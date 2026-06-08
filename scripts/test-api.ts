
import { api } from '../src/lib/api';

const BASE_URL = 'http://localhost:3001/api';

// Mock the API client for node environment since the original one relies on relative paths and browser fetch
// Actually, let's just use native fetch with a helper
async function request(method: string, endpoint: string, token?: string, body?: any) {
  const headers: any = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const options: any = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, options);
    const contentType = res.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    return {
      status: res.status,
      ok: res.ok,
      data
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error
    };
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  let token = '';

  // 1. Test Public Endpoints
  console.log('--- Public Endpoints ---');
  
  // GET /settings
  const settings = await request('GET', '/settings');
  console.log(`GET /settings: ${settings.status} ${settings.ok ? '✅' : '❌'}`);
  if (!settings.ok) console.log('Error:', settings.data);

  // GET /issues
  const issues = await request('GET', '/issues');
  console.log(`GET /issues: ${issues.status} ${issues.ok ? '✅' : '❌'}`);

  // GET /articles
  const articles = await request('GET', '/articles');
  console.log(`GET /articles: ${articles.status} ${articles.ok ? '✅' : '❌'}`);

  // GET /board-members
  const board = await request('GET', '/board-members');
  console.log(`GET /board-members: ${board.status} ${board.ok ? '✅' : '❌'}`);

  console.log('\n--- Authentication ---');

  // 2. Login
  const login = await request('POST', '/auth/login', undefined, {
    username: 'admin',
    password: 'admin123'
  });
  console.log(`POST /auth/login: ${login.status} ${login.ok ? '✅' : '❌'}`);
  
  if (login.ok && login.data.token) {
    token = login.data.token;
    console.log('Token received.');
  } else {
    console.error('Login failed. Aborting protected route tests.');
    console.error(login.data);
    return;
  }

  console.log('\n--- Protected Endpoints (Admin) ---');

  // 3. Test Protected Endpoints
  
  // PUT /settings
  const updateSettings = await request('PUT', '/settings', token, {
    ...settings.data.data,
    description: 'Updated via test script ' + new Date().toISOString()
  });
  console.log(`PUT /settings: ${updateSettings.status} ${updateSettings.ok ? '✅' : '❌'}`);

  // POST /issues
  const newIssue = await request('POST', '/issues', token, {
    volume: 99,
    issue_number: 1,
    title: 'Test Issue',
    publication_date: new Date().toISOString()
  });
  console.log(`POST /issues: ${newIssue.status} ${newIssue.ok ? '✅' : '❌'}`);
  let issueId;
  if (newIssue.ok) issueId = newIssue.data.data.id;

  // POST /articles (if issue created)
  if (issueId) {
    const newArticle = await request('POST', '/articles', token, {
      issue_id: issueId,
      title: 'Test Article',
      abstract: 'Test Abstract',
      authors: [{ name: 'Test Author', email: 'test@example.com' }]
    });
    console.log(`POST /articles: ${newArticle.status} ${newArticle.ok ? '✅' : '❌'}`);
    
    if (newArticle.ok) {
        const articleId = newArticle.data.data.id;
        // DELETE Article
        const deleteArticle = await request('DELETE', `/articles/${articleId}`, token);
        console.log(`DELETE /articles/${articleId}: ${deleteArticle.status} ${deleteArticle.ok ? '✅' : '❌'}`);
    }

    // DELETE Issue
    const deleteIssue = await request('DELETE', `/issues/${issueId}`, token);
    console.log(`DELETE /issues/${issueId}: ${deleteIssue.status} ${deleteIssue.ok ? '✅' : '❌'}`);
  }

  // GET /certificates/conferences
  const conferences = await request('GET', '/certificates/conferences');
  console.log(`GET /certificates/conferences: ${conferences.status} ${conferences.ok ? '✅' : '❌'}`);

  // POST /certificates/conferences (Create dummy conference)
  const newConference = await request('POST', '/certificates/conferences', token, {
      name: "Test Conference",
      conference_year: 2025,
      date: new Date().toISOString()
  });
  console.log(`POST /certificates/conferences: ${newConference.status} ${newConference.ok ? '✅' : '❌'}`);
  
  if (newConference.ok) {
      const confId = newConference.data.data.id;
      const deleteConf = await request('DELETE', `/certificates/conferences/${confId}`, token);
      console.log(`DELETE /certificates/conferences/${confId}: ${deleteConf.status} ${deleteConf.ok ? '✅' : '❌'}`);
  }

  // GET /awards/categories
  const awardCats = await request('GET', '/awards/categories');
  console.log(`GET /awards/categories: ${awardCats.status} ${awardCats.ok ? '✅' : '❌'}`);

  // 4. Expanded Coverage Tests
  console.log('\n--- Expanded Coverage ---');

  // GET /auth/me
  const me = await request('GET', '/auth/me', token);
  console.log(`GET /auth/me: ${me.status} ${me.ok ? '✅' : '❌'}`);

  // Board Members CRUD
  const newMember = await request('POST', '/board-members', token, {
    name: 'Test Member',
    role: 'Test Role'
  });
  console.log(`POST /board-members: ${newMember.status} ${newMember.ok ? '✅' : '❌'}`);
  if (newMember.ok) {
    const memId = newMember.data.data.id;
    const updateMem = await request('PUT', `/board-members/${memId}`, token, { name: 'Updated Member' });
    console.log(`PUT /board-members/${memId}: ${updateMem.status} ${updateMem.ok ? '✅' : '❌'}`);
    const delMem = await request('DELETE', `/board-members/${memId}`, token);
    console.log(`DELETE /board-members/${memId}: ${delMem.status} ${delMem.ok ? '✅' : '❌'}`);
  }

  // Award Categories CRUD
  const newCat = await request('POST', '/awards/categories', token, {
    name: 'Test Category',
    award_type: 'article'
  });
  console.log(`POST /awards/categories: ${newCat.status} ${newCat.ok ? '✅' : '❌'}`);
  if (newCat.ok) {
    const catId = newCat.data.data.id;
    const updateCat = await request('PUT', `/awards/categories/${catId}`, token, { name: 'Updated Category' });
    console.log(`PUT /awards/categories/${catId}: ${updateCat.status} ${updateCat.ok ? '✅' : '❌'}`);
    const delCat = await request('DELETE', `/awards/categories/${catId}`, token);
    console.log(`DELETE /awards/categories/${catId}: ${delCat.status} ${delCat.ok ? '✅' : '❌'}`);
  }

  console.log('\n✅ Tests Completed');
}

runTests();
