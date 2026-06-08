import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...\n')

  // ── Clean existing data (in correct order for foreign keys) ──
  console.log('🧹 Cleaning existing data...')
  await prisma.articleAuthor.deleteMany()
  await prisma.article.deleteMany()
  await prisma.author.deleteMany()
  await prisma.issue.deleteMany()
  await prisma.boardMember.deleteMany()
  await prisma.conference.deleteMany()
  console.log('  ✓ Existing data cleared\n')

  // ── Journal Settings ──
  console.log('📰 Creating journal settings...')
  const journal = await prisma.journal.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Global Insights Journal',
      issn: '2XXX-XXXX',
      description:
        'Global Insights Journal (GIJ) is an internationally recognized, peer-reviewed, open-access journal dedicated to publishing high-quality original research, review articles, and cutting-edge studies across all major disciplines of science, technology, engineering, social sciences, and humanities. Our mission is to bridge the gap between academic research and real-world application by providing a platform for scholars, researchers, and practitioners worldwide.',
      institution: 'Visenary Analytics Research Association',
      contact_email: 'info@va-ra.co',
      address: 'Vrijthof 55, 6211 LE Maastricht, The Netherlands',
      doi_prefix: '10.55001/gij',
    },
  })
  console.log(`  ✓ Journal: ${journal.title}\n`)

  // ── Admin User ──
  console.log('👤 Creating admin user...')
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password_hash: hashedPassword,
      email: 'info@va-ra.co',
    },
  })
  console.log('  ✓ Admin: admin / admin123\n')

  // ── Editorial Board ──
  console.log('👥 Creating board members...')
  const boardMembers = [
    {
      name: 'Prof. Dr. Eleanor M. Whitfield',
      title: 'Distinguished Professor of Computer Science',
      affiliation: 'Massachusetts Institute of Technology (MIT), USA',
      email: 'e.whitfield@mit.edu',
      role: 'Editor-in-Chief',
      display_order: 1,
    },
    {
      name: 'Prof. Dr. Rajesh K. Sharma',
      title: 'Professor of Artificial Intelligence',
      affiliation: 'Indian Institute of Technology Delhi, India',
      email: 'r.sharma@iitd.ac.in',
      role: 'Associate Editor',
      display_order: 2,
    },
    {
      name: 'Dr. Maria Gonzalez-Ruiz',
      title: 'Associate Professor of Environmental Science',
      affiliation: 'Universidad Autónoma de Madrid, Spain',
      email: 'm.gonzalez@uam.es',
      role: 'Associate Editor',
      display_order: 3,
    },
    {
      name: 'Prof. Dr. Hiroshi Tanaka',
      title: 'Professor of Biomedical Engineering',
      affiliation: 'University of Tokyo, Japan',
      email: 'h.tanaka@u-tokyo.ac.jp',
      role: 'Associate Editor',
      display_order: 4,
    },
    {
      name: 'Dr. Sarah L. Chen',
      title: 'Senior Research Fellow, Data Science',
      affiliation: 'University of Oxford, United Kingdom',
      email: 's.chen@ox.ac.uk',
      role: 'Advisory Board',
      display_order: 5,
    },
    {
      name: 'Prof. Dr. Ahmed Hassan',
      title: 'Professor of Renewable Energy Systems',
      affiliation: 'Cairo University, Egypt',
      email: 'a.hassan@cu.edu.eg',
      role: 'Advisory Board',
      display_order: 6,
    },
    {
      name: 'Dr. Anastasia Petrova',
      title: 'Associate Professor of Computational Biology',
      affiliation: 'ETH Zurich, Switzerland',
      email: 'a.petrova@ethz.ch',
      role: 'Advisory Board',
      display_order: 7,
    },
    {
      name: 'Dr. James O. Mensah',
      title: 'Lecturer in Machine Learning',
      affiliation: 'University of Cape Town, South Africa',
      email: 'j.mensah@uct.ac.za',
      role: 'Reviewer',
      display_order: 8,
    },
    {
      name: 'Dr. Li Wei',
      title: 'Research Scientist, NLP',
      affiliation: 'Tsinghua University, China',
      email: 'l.wei@tsinghua.edu.cn',
      role: 'Reviewer',
      display_order: 9,
    },
    {
      name: 'Dr. Fatima Al-Rashidi',
      title: 'Assistant Professor of Nanotechnology',
      affiliation: 'King Abdullah University of Science and Technology, Saudi Arabia',
      email: 'f.alrashidi@kaust.edu.sa',
      role: 'Reviewer',
      display_order: 10,
    },
  ]

  for (const member of boardMembers) {
    await prisma.boardMember.create({ data: member })
  }
  console.log(`  ✓ ${boardMembers.length} board members created\n`)

  // ── Issues ──
  console.log('📖 Creating issues...')
  const issueData = [
    {
      volume: 1,
      issue_number: 1,
      title: 'Inaugural Issue: Foundations of Modern Research',
      publication_date: new Date('2025-01-15'),
      description:
        'Our inaugural issue features seminal works spanning artificial intelligence, environmental sustainability, biomedical innovation, and social science methodology.',
    },
    {
      volume: 1,
      issue_number: 2,
      title: 'Advances in Computational Intelligence',
      publication_date: new Date('2025-04-15'),
      description:
        'This issue explores the latest breakthroughs in deep learning, natural language processing, and intelligent systems with applications across industries.',
    },
    {
      volume: 1,
      issue_number: 3,
      title: 'Sustainable Development and Green Technologies',
      publication_date: new Date('2025-07-15'),
      description:
        'Dedicated to research addressing climate change mitigation, renewable energy optimization, and circular economy frameworks.',
    },
    {
      volume: 2,
      issue_number: 1,
      title: 'Data Science and Society',
      publication_date: new Date('2025-10-15'),
      description:
        'Examining the intersection of big data analytics, privacy concerns, algorithmic fairness, and the societal impact of data-driven decision making.',
    },
    {
      volume: 2,
      issue_number: 2,
      title: 'Biomedical Engineering Frontiers',
      publication_date: new Date('2026-01-15'),
      description:
        'Featuring cutting-edge research in medical imaging, drug delivery systems, tissue engineering, and AI-assisted diagnostics.',
    },

    // ── Volume 5 — 2025 (Monthly Issues 1–12) ──
    {
      volume: 5,
      issue_number: 1,
      title: 'Machine Learning Foundations and Applications',
      publication_date: new Date('2025-01-15'),
      description:
        'This issue presents foundational advances in machine learning including transformer architectures, AutoML benchmarking, continual learning strategies, cross-domain transfer learning, and generative diffusion models for time-series synthesis.',
    },
    {
      volume: 5,
      issue_number: 2,
      title: 'Climate Science and Environmental Engineering',
      publication_date: new Date('2025-02-15'),
      description:
        'Dedicated to urgent climate research encompassing permafrost methane feedback, ocean acidification impacts on coral reefs, ensemble wildfire risk prediction, blue carbon ecosystem valuation, and enhanced rock weathering field trials.',
    },
    {
      volume: 5,
      issue_number: 3,
      title: 'Biomedical Sciences and Healthcare Technology',
      publication_date: new Date('2025-03-15'),
      description:
        'Featuring innovations in mRNA neoantigen immunotherapy, continuous glucose monitoring with ML prediction, gut microbiome and mental health causal inference, robotic-assisted surgery meta-analysis, and AI-based Alzheimer early detection.',
    },
    {
      volume: 5,
      issue_number: 4,
      title: 'Social Sciences and Digital Humanities',
      publication_date: new Date('2025-04-15'),
      description:
        'Exploring the intersection of digital technologies and society through misinformation detection, remote-work urban mobility shifts, AI-assisted manuscript digitization, platform labor rights, and multinational youth civic engagement.',
    },
    {
      volume: 5,
      issue_number: 5,
      title: 'Quantum Computing and Advanced Materials',
      publication_date: new Date('2025-05-15'),
      description:
        'Presenting breakthroughs in ambient-pressure superconductivity, fault-tolerant trapped-ion processors, MOF-based direct air capture, Majorana fermion spectroscopy, and valleytronic MoS₂/WSe₂ heterostructure devices.',
    },
    {
      volume: 5,
      issue_number: 6,
      title: 'Energy Systems and Sustainable Innovation',
      publication_date: new Date('2025-06-15'),
      description:
        'Covering green hydrogen via solid oxide electrolysis, flow battery vs. lithium-ion grid storage economics, offshore wind layout optimization, agrivoltaic dual land use, and compact fusion reactor commercial roadmaps.',
    },
    {
      volume: 5,
      issue_number: 7,
      title: 'Robotics, Automation, and Autonomous Systems',
      publication_date: new Date('2025-07-15'),
      description:
        'Showcasing heterogeneous swarm robotics for disaster response, biomimetic soft-robot locomotion, trust calibration in human-robot collaboration, LiDAR-inertial mine SLAM, and long-range autonomous underwater gliders.',
    },
    {
      volume: 5,
      issue_number: 8,
      title: 'Cybersecurity, Privacy, and Network Systems',
      publication_date: new Date('2025-08-15'),
      description:
        'Addressing post-quantum cryptography on embedded hardware, adversarial attacks on graph-based intrusion detection, zero-trust healthcare deployment, multi-modal deepfake detection, and IoT firmware vulnerability analysis.',
    },
    {
      volume: 5,
      issue_number: 9,
      title: 'Computational Biology and Bioinformatics',
      publication_date: new Date('2025-09-15'),
      description:
        'Focusing on AlphaFold-Multimer benchmarking against cryo-EM, spatial transcriptomics of pancreatic tumors, epigenome-wide heat-stress methylation, pan-genome K. pneumoniae analysis, and liquid biopsy colorectal cancer markers.',
    },
    {
      volume: 5,
      issue_number: 10,
      title: 'Economics, Finance, and Data Analytics',
      publication_date: new Date('2025-10-15'),
      description:
        'Examining retail CBDC financial inclusion pilots, post-COVID supply chain reshoring analysis, ML-based economic nowcasting with alternative data, innovation-inequality patterns from patent data, and ESG fund crisis-period performance.',
    },
    {
      volume: 5,
      issue_number: 11,
      title: 'Materials Science and Nanotechnology',
      publication_date: new Date('2025-11-15'),
      description:
        'Presenting vitrimeric self-healing nanocomposites for aerospace, COF-interlayer lithium-sulfur batteries, MWCNT-reinforced marine cement, pH-responsive lipid-polymer nanoparticles for oncology, and 2D spintronic Cr₂Ge₂Te₆ devices.',
    },
    {
      volume: 5,
      issue_number: 12,
      title: 'Interdisciplinary Research and Global Challenges',
      publication_date: new Date('2025-12-15'),
      description:
        'A capstone interdisciplinary issue synthesizing AI climate model emulators, One Health pandemic surveillance, smart city well-being causal analysis, CRISPR germline ethics, climate-smart African agriculture, and academic technology transfer.',
    },
  ]

  const createdIssues: any[] = []
  for (const issue of issueData) {
    const created = await prisma.issue.create({ data: issue })
    createdIssues.push(created)
  }
  console.log(`  ✓ ${createdIssues.length} issues created\n`)

  // ── Authors ──
  console.log('✍️  Creating authors...')
  const authorData = [
    { name: 'Dr. Michael A. Rodriguez', email: 'mrodriguez@stanford.edu', affiliation: 'Stanford University, USA', orcid: '0000-0001-2345-6789' },
    { name: 'Prof. Yuki Nakamura', email: 'y.nakamura@kyoto-u.ac.jp', affiliation: 'Kyoto University, Japan', orcid: '0000-0002-3456-7890' },
    { name: 'Dr. Priya Patel', email: 'p.patel@iisc.ac.in', affiliation: 'Indian Institute of Science, India', orcid: '0000-0003-4567-8901' },
    { name: 'Prof. Hans Müller', email: 'h.mueller@tum.de', affiliation: 'Technical University of Munich, Germany', orcid: '0000-0004-5678-9012' },
    { name: 'Dr. Amara Okafor', email: 'a.okafor@unilag.edu.ng', affiliation: 'University of Lagos, Nigeria', orcid: '0000-0005-6789-0123' },
    { name: 'Prof. Jean-Luc Moreau', email: 'jl.moreau@sorbonne.fr', affiliation: 'Sorbonne University, France', orcid: '0000-0006-7890-1234' },
    { name: 'Dr. Sofia Andersson', email: 's.andersson@kth.se', affiliation: 'KTH Royal Institute of Technology, Sweden', orcid: '0000-0007-8901-2345' },
    { name: 'Prof. Carlos Mendoza', email: 'c.mendoza@unam.mx', affiliation: 'National Autonomous University of Mexico, Mexico', orcid: '0000-0008-9012-3456' },
    { name: 'Dr. Fatou Diallo', email: 'f.diallo@ucad.edu.sn', affiliation: 'Cheikh Anta Diop University, Senegal', orcid: '0000-0009-0123-4567' },
    { name: 'Prof. John T. Williams', email: 'j.williams@cam.ac.uk', affiliation: 'University of Cambridge, UK', orcid: '0000-0010-1234-5678' },
    { name: 'Dr. Min-Jun Park', email: 'm.park@snu.ac.kr', affiliation: 'Seoul National University, South Korea', orcid: '0000-0011-2345-6789' },
    { name: 'Dr. Isabella Rossi', email: 'i.rossi@polimi.it', affiliation: 'Politecnico di Milano, Italy', orcid: '0000-0012-3456-7890' },
    { name: 'Prof. Olga Ivanova', email: 'o.ivanova@msu.ru', affiliation: 'Moscow State University, Russia', orcid: '0000-0013-4567-8901' },
    { name: 'Dr. David Kim', email: 'd.kim@berkeley.edu', affiliation: 'UC Berkeley, USA', orcid: '0000-0014-5678-9012' },
    { name: 'Prof. Chen Xiaoming', email: 'c.xiaoming@pku.edu.cn', affiliation: 'Peking University, China', orcid: '0000-0015-6789-0123' },
    { name: 'Dr. Emma Thompson', email: 'e.thompson@unimelb.edu.au', affiliation: 'University of Melbourne, Australia', orcid: '0000-0016-7890-1234' },
    { name: 'Prof. Ahmed Zaki', email: 'a.zaki@aucegypt.edu', affiliation: 'American University in Cairo, Egypt', orcid: '0000-0017-8901-2345' },
    { name: 'Dr. Laura Fischer', email: 'l.fischer@uzh.ch', affiliation: 'University of Zurich, Switzerland', orcid: '0000-0018-9012-3456' },
    { name: 'Prof. Robert O\'Brien', email: 'r.obrien@tcd.ie', affiliation: 'Trinity College Dublin, Ireland', orcid: '0000-0019-0123-4567' },
    { name: 'Dr. Kenji Watanabe', email: 'k.watanabe@tohoku.ac.jp', affiliation: 'Tohoku University, Japan', orcid: '0000-0020-1234-5678' },
    { name: 'Dr. Natasha Kowalski', email: 'n.kowalski@pw.edu.pl', affiliation: 'Warsaw University of Technology, Poland', orcid: '0000-0021-2345-6789' },
    { name: 'Prof. Vikram Rajput', email: 'v.rajput@iitb.ac.in', affiliation: 'Indian Institute of Technology Bombay, India', orcid: '0000-0022-3456-7890' },
    { name: 'Dr. Tobias Becker', email: 't.becker@uni-heidelberg.de', affiliation: 'Heidelberg University, Germany', orcid: '0000-0023-4567-8901' },
    { name: 'Prof. Mei Lin', email: 'm.lin@fudan.edu.cn', affiliation: 'Fudan University, China', orcid: '0000-0024-5678-9012' },
    { name: 'Dr. Elena Marchetti', email: 'e.marchetti@unibo.it', affiliation: 'University of Bologna, Italy', orcid: '0000-0025-6789-0123' },
    { name: 'Prof. Samuel Okonkwo', email: 's.okonkwo@ui.edu.ng', affiliation: 'University of Ibadan, Nigeria', orcid: '0000-0026-7890-1234' },
    { name: 'Dr. Anna-Lee Jensen', email: 'al.jensen@ku.dk', affiliation: 'University of Copenhagen, Denmark', orcid: '0000-0027-8901-2345' },
    { name: 'Prof. Yousef Al-Jabri', email: 'y.aljabri@squ.edu.om', affiliation: 'Sultan Qaboos University, Oman', orcid: '0000-0028-9012-3456' },
    { name: 'Dr. Camille Dubois', email: 'c.dubois@polytechnique.fr', affiliation: 'École Polytechnique, France', orcid: '0000-0029-0123-4567' },
    { name: 'Prof. Rakesh Gupta', email: 'r.gupta@iitk.ac.in', affiliation: 'Indian Institute of Technology Kanpur, India', orcid: '0000-0030-1234-5678' },
    { name: 'Dr. Kim Sung-Hoon', email: 'sh.kim@kaist.ac.kr', affiliation: 'KAIST, South Korea', orcid: '0000-0031-2345-6789' },
    { name: 'Prof. Valentina Petrov', email: 'v.petrov@uni-sofia.bg', affiliation: 'Sofia University, Bulgaria', orcid: '0000-0032-3456-7890' },
    { name: 'Dr. Hamid Moradi', email: 'h.moradi@sharif.edu', affiliation: 'Sharif University of Technology, Iran', orcid: '0000-0033-4567-8901' },
    { name: 'Prof. Ingrid Larsson', email: 'i.larsson@uu.se', affiliation: 'Uppsala University, Sweden', orcid: '0000-0034-5678-9012' },
    { name: 'Dr. Marco Almeida', email: 'm.almeida@ulisboa.pt', affiliation: 'University of Lisbon, Portugal', orcid: '0000-0035-6789-0123' },
    { name: 'Prof. Aisha Mbeki', email: 'a.mbeki@uonbi.ac.ke', affiliation: 'University of Nairobi, Kenya', orcid: '0000-0036-7890-1234' },
    { name: 'Dr. Pablo Fernández', email: 'p.fernandez@uba.ar', affiliation: 'University of Buenos Aires, Argentina', orcid: '0000-0037-8901-2345' },
    { name: 'Prof. Nadia Rashwan', email: 'n.rashwan@alexu.edu.eg', affiliation: 'Alexandria University, Egypt', orcid: '0000-0038-9012-3456' },
    { name: 'Dr. Takeshi Kimura', email: 't.kimura@osaka-u.ac.jp', affiliation: 'Osaka University, Japan', orcid: '0000-0039-0123-4567' },
    { name: 'Prof. Diana Novak', email: 'd.novak@cuni.cz', affiliation: 'Charles University, Czech Republic', orcid: '0000-0040-1234-5678' },
  ]

  const createdAuthors: any[] = []
  await prisma.author.createMany({ data: authorData })
  const allAuthors = await prisma.author.findMany({ orderBy: { id: 'asc' } })
  createdAuthors.push(...allAuthors)
  console.log(`  ✓ ${createdAuthors.length} authors created\n`)

  // ── Articles ──
  console.log('📄 Creating articles...')
  const articles = [
    // ── Vol 1, Issue 1 ──
    {
      issue_idx: 0,
      title: 'Transformer Architectures for Multi-Modal Learning: A Comprehensive Survey and Empirical Analysis',
      abstract:
        'This paper presents a comprehensive survey of transformer-based architectures designed for multi-modal learning tasks. We systematically review over 200 recent publications, categorize existing approaches into fusion-based, alignment-based, and generation-based paradigms, and provide an empirical analysis comparing 15 state-of-the-art models on benchmark datasets including MS-COCO, Visual Genome, and AudioSet. Our experiments reveal that cross-attention fusion mechanisms consistently outperform late-fusion approaches by 12-18% on multi-modal retrieval tasks. We identify key challenges including computational efficiency, modality imbalance, and domain adaptation, and propose a unified evaluation framework for future research in this rapidly evolving field.',
      keywords: 'transformers, multi-modal learning, deep learning, attention mechanisms, computer vision, natural language processing',
      doi: '10.55001/gij.2025.01.001',
      page_start: 1,
      page_end: 28,
      submission_date: new Date('2024-10-05'),
      acceptance_date: new Date('2024-12-20'),
      author_ids: [0, 2, 14],
      corresponding: 0,
    },
    {
      issue_idx: 0,
      title: 'Carbon Sequestration Potential of Urban Green Infrastructure: A Meta-Analysis of Global Studies',
      abstract:
        'Urban green infrastructure (UGI) plays a critical role in mitigating climate change through carbon sequestration. This meta-analysis synthesizes data from 156 studies spanning 42 countries over the past two decades to quantify the carbon sequestration potential of various UGI typologies. Results indicate that urban forests sequester an average of 11.2 tonnes CO₂ ha⁻¹ yr⁻¹, followed by green roofs (3.8 tonnes CO₂ ha⁻¹ yr⁻¹) and urban wetlands (8.7 tonnes CO₂ ha⁻¹ yr⁻¹). We develop a predictive model incorporating climate zone, vegetation density, and management practices that explains 78% of the variance in sequestration rates. Policy implications and recommendations for urban planners are discussed.',
      keywords: 'carbon sequestration, urban green infrastructure, climate change, meta-analysis, sustainable cities, green roofs',
      doi: '10.55001/gij.2025.01.002',
      page_start: 29,
      page_end: 52,
      submission_date: new Date('2024-09-15'),
      acceptance_date: new Date('2024-12-10'),
      author_ids: [5, 8],
      corresponding: 0,
    },
    {
      issue_idx: 0,
      title: 'CRISPR-Cas13 Mediated Diagnostics for Emerging Viral Pathogens: Development and Validation',
      abstract:
        'Rapid and accurate diagnostics are essential for controlling emerging infectious diseases. This study presents the development and clinical validation of a CRISPR-Cas13-based diagnostic platform (RAPID-Detect) for the simultaneous detection of multiple respiratory viral pathogens. The assay achieved a sensitivity of 98.7% and specificity of 99.2% across 1,247 clinical samples when compared to RT-qPCR gold standards. The platform provides results within 45 minutes without requiring sophisticated laboratory equipment, making it suitable for point-of-care settings in resource-limited environments. Cost analysis indicates per-test expenses of approximately $2.50, representing a 90% reduction compared to conventional molecular testing.',
      keywords: 'CRISPR-Cas13, diagnostics, viral detection, point-of-care, molecular biology, infectious diseases',
      doi: '10.55001/gij.2025.01.003',
      page_start: 53,
      page_end: 74,
      submission_date: new Date('2024-10-20'),
      acceptance_date: new Date('2024-12-28'),
      author_ids: [1, 3, 19],
      corresponding: 1,
    },
    {
      issue_idx: 0,
      title: 'The Digital Divide Revisited: Socioeconomic Determinants of Internet Adoption in Sub-Saharan Africa',
      abstract:
        'Despite rapid digital expansion globally, Sub-Saharan Africa continues to experience significant disparities in internet access and digital literacy. Using a mixed-methods approach combining nationally representative survey data from 15 countries (N = 47,230) with qualitative interviews (N = 120), this study examines the multidimensional determinants of internet adoption. Our structural equation model reveals that income, education level, and urban residency explain 62% of variance in adoption rates, while gender-based barriers independently reduce female adoption probability by 23%. We propose a Digital Inclusion Index (DII) and policy framework addressing infrastructure, affordability, and digital literacy as interconnected pillars.',
      keywords: 'digital divide, internet adoption, Sub-Saharan Africa, socioeconomic factors, digital literacy, ICT policy',
      doi: '10.55001/gij.2025.01.004',
      page_start: 75,
      page_end: 98,
      submission_date: new Date('2024-09-28'),
      acceptance_date: new Date('2024-12-15'),
      author_ids: [4, 8],
      corresponding: 0,
    },

    // ── Vol 1, Issue 2 ──
    {
      issue_idx: 1,
      title: 'Federated Learning with Differential Privacy: Balancing Utility and Protection in Healthcare Applications',
      abstract:
        'Federated learning (FL) has emerged as a promising paradigm for collaborative model training across healthcare institutions while preserving patient privacy. However, the integration of differential privacy (DP) mechanisms often degrades model performance significantly. This paper proposes AdaptiveDP-FL, a novel framework that dynamically adjusts privacy budgets based on data sensitivity levels and model convergence rates. Evaluated on three large-scale clinical datasets covering radiology (1.2M images), genomics (500K sequences), and electronic health records (2.3M patient encounters), our approach achieves 94.3% of the centralized model accuracy while maintaining ε-differential privacy guarantees (ε = 1.0). Compared to existing approaches, AdaptiveDP-FL reduces the privacy-utility gap by 35%.',
      keywords: 'federated learning, differential privacy, healthcare, machine learning, data privacy, medical AI',
      doi: '10.55001/gij.2025.02.001',
      page_start: 1,
      page_end: 30,
      submission_date: new Date('2025-01-10'),
      acceptance_date: new Date('2025-03-25'),
      author_ids: [0, 13, 10],
      corresponding: 0,
    },
    {
      issue_idx: 1,
      title: 'Explainable AI in Autonomous Driving: Interpretable Decision-Making for Safety-Critical Systems',
      abstract:
        'As autonomous vehicles move toward widespread deployment, the ability to explain their decision-making processes becomes paramount for regulatory compliance, user trust, and safety verification. This paper introduces InterpretDrive, a hierarchical explainability framework that provides human-interpretable rationales for autonomous driving decisions at three levels: perception, prediction, and planning. Using a novel attention-guided concept extraction method, our system generates natural language explanations with 91% semantic accuracy as judged by human evaluators. Real-world testing across 50,000 km of driving scenarios demonstrates that InterpretDrive maintains decision latency below 50ms while providing explanations that improve passenger trust by 44% compared to black-box systems.',
      keywords: 'explainable AI, autonomous driving, interpretability, safety-critical systems, deep learning, trust',
      doi: '10.55001/gij.2025.02.002',
      page_start: 31,
      page_end: 58,
      submission_date: new Date('2025-01-25'),
      acceptance_date: new Date('2025-03-30'),
      author_ids: [3, 6, 11],
      corresponding: 1,
    },
    {
      issue_idx: 1,
      title: 'Graph Neural Networks for Drug-Drug Interaction Prediction: A Heterogeneous Knowledge Graph Approach',
      abstract:
        'Predicting adverse drug-drug interactions (DDIs) is crucial for patient safety and drug development. This paper proposes HetGNN-DDI, a heterogeneous graph neural network that integrates molecular structures, protein targets, metabolic pathways, and clinical phenotypes into a unified knowledge graph containing 2.5 million nodes and 18 million edges. Our model achieves an AUROC of 0.967 on the DrugBank DDI benchmark, surpassing existing methods by 4.2%. Through novel subgraph attention mechanisms, HetGNN-DDI also provides mechanistic explanations for predicted interactions, identifying potential pharmacokinetic and pharmacodynamic pathways. Prospective validation on 500 unlabeled drug pairs confirmed 89% of model predictions.',
      keywords: 'graph neural networks, drug interactions, knowledge graphs, pharmacology, deep learning, drug safety',
      doi: '10.55001/gij.2025.02.003',
      page_start: 59,
      page_end: 82,
      submission_date: new Date('2025-02-05'),
      acceptance_date: new Date('2025-04-01'),
      author_ids: [1, 12, 17],
      corresponding: 0,
    },
    {
      issue_idx: 1,
      title: 'Quantum Machine Learning for Combinatorial Optimization: Benchmarking QAOA on Real Hardware',
      abstract:
        'Quantum approximate optimization algorithm (QAOA) represents a promising approach for solving combinatorial optimization problems on near-term quantum devices. This paper provides the first comprehensive benchmark of QAOA performance on IBM Quantum and Google Sycamore processors for portfolio optimization, vehicle routing, and job scheduling problems with up to 50 qubits. Our results demonstrate that depth-5 QAOA achieves approximation ratios of 0.87±0.04 for MaxCut instances, competitive with classical simulated annealing for problem sizes n ≤ 40. We introduce noise-aware parameter initialization strategies that improve convergence rates by 3× on noisy hardware and discuss the practical quantum advantage threshold.',
      keywords: 'quantum computing, QAOA, combinatorial optimization, quantum machine learning, benchmarking, quantum hardware',
      doi: '10.55001/gij.2025.02.004',
      page_start: 83,
      page_end: 108,
      submission_date: new Date('2025-01-18'),
      acceptance_date: new Date('2025-03-28'),
      author_ids: [9, 14],
      corresponding: 0,
    },

    // ── Vol 1, Issue 3 ──
    {
      issue_idx: 2,
      title: 'Perovskite-Silicon Tandem Solar Cells: Achieving 32.5% Efficiency Through Interface Engineering',
      abstract:
        'Perovskite-silicon tandem solar cells hold the potential to surpass single-junction efficiency limits at commercially viable costs. This paper reports a record-breaking 32.5% power conversion efficiency (certified) achieved through a novel self-assembled monolayer (SAM) interface between the perovskite top cell and silicon bottom cell. Our interface engineering approach reduces recombination losses by 75% compared to conventional buffer layers, while a conformal atomic layer deposition (ALD) process ensures long-term stability. Accelerated aging tests (1000 hours, 85°C, 85% RH) demonstrate less than 5% efficiency degradation. Techno-economic analysis indicates a levelized cost of electricity (LCOE) of $0.025/kWh at manufacturing scale, competitive with fossil fuels.',
      keywords: 'perovskite solar cells, tandem cells, silicon, photovoltaics, interface engineering, renewable energy',
      doi: '10.55001/gij.2025.03.001',
      page_start: 1,
      page_end: 26,
      submission_date: new Date('2025-04-01'),
      acceptance_date: new Date('2025-06-20'),
      author_ids: [3, 16, 6],
      corresponding: 1,
    },
    {
      issue_idx: 2,
      title: 'Microplastic Contamination in Deep-Sea Sediments: A Global Assessment Using Machine Learning Classification',
      abstract:
        'The extent of microplastic contamination in deep-sea environments remains poorly characterized. This study presents the largest systematic survey to date, analyzing 3,250 sediment samples from 120 deep-sea sites across the Atlantic, Pacific, and Indian Oceans at depths ranging from 1,000 to 11,000 meters. Using a convolutional neural network trained on FTIR spectroscopy data (classification accuracy: 97.3%), we identified microplastics in 94% of samples with a mean concentration of 14.3 ± 8.2 particles kg⁻¹. Statistical modeling reveals proximity to surface current convergence zones and depth as primary predictors of contamination levels. Our findings indicate that the deep-sea floor serves as a significant sink for microplastic pollution.',
      keywords: 'microplastics, deep-sea pollution, machine learning, environmental monitoring, ocean contamination, FTIR spectroscopy',
      doi: '10.55001/gij.2025.03.002',
      page_start: 27,
      page_end: 50,
      submission_date: new Date('2025-04-15'),
      acceptance_date: new Date('2025-06-28'),
      author_ids: [5, 7, 15],
      corresponding: 0,
    },
    {
      issue_idx: 2,
      title: 'Circular Economy Business Models in Manufacturing: A Systematic Review and Typology Development',
      abstract:
        'The transition to a circular economy requires fundamental changes in business models across manufacturing sectors. This systematic review analyzes 284 peer-reviewed articles published between 2015 and 2025 to develop a comprehensive typology of circular economy business models (CEBMs) in manufacturing. We identify five archetypal CEBM categories: product-as-service, sharing platforms, product life extension, resource recovery, and circular supply chains. Using fuzzy-set qualitative comparative analysis (fsQCA) on 85 case studies, we determine that successful CEBM implementation requires the combination of digital capabilities, stakeholder collaboration, and supportive regulatory frameworks. Environmental impact assessment reveals potential CO₂ emission reductions of 30-65% compared to linear models.',
      keywords: 'circular economy, business models, manufacturing, sustainability, systematic review, resource efficiency',
      doi: '10.55001/gij.2025.03.003',
      page_start: 51,
      page_end: 78,
      submission_date: new Date('2025-03-28'),
      acceptance_date: new Date('2025-06-15'),
      author_ids: [11, 18],
      corresponding: 1,
    },

    // ── Vol 2, Issue 1 ──
    {
      issue_idx: 3,
      title: 'Large Language Models as Scientific Research Assistants: Capabilities, Limitations, and Ethical Considerations',
      abstract:
        'Large language models (LLMs) are increasingly being integrated into scientific research workflows, from literature review to hypothesis generation and experimental design. This paper presents a comprehensive evaluation of GPT-4, Claude, and open-source alternatives across 12 scientific domains using a standardized benchmark of 5,000 research tasks. Our assessment reveals that LLMs achieve expert-level performance in literature synthesis (88% accuracy) and methodology suggestion (79%), but struggle with mathematical proof verification (43%) and experimental reproducibility assessment (51%). We conduct surveys with 450 researchers across 28 countries to understand adoption patterns and concerns. An ethical framework addressing authorship, intellectual property, and research integrity in the age of AI-assisted science is proposed.',
      keywords: 'large language models, scientific research, AI ethics, GPT-4, research methodology, artificial intelligence',
      doi: '10.55001/gij.2025.04.001',
      page_start: 1,
      page_end: 34,
      submission_date: new Date('2025-07-10'),
      acceptance_date: new Date('2025-09-25'),
      author_ids: [0, 9, 4],
      corresponding: 0,
    },
    {
      issue_idx: 3,
      title: 'Privacy-Preserving Genomic Data Sharing Using Homomorphic Encryption: A Scalable Framework',
      abstract:
        'Genomic data sharing is essential for advancing precision medicine but raises significant privacy concerns. This paper introduces GenomeCrypt, a scalable framework for privacy-preserving genomic data analysis using fully homomorphic encryption (FHE). Our optimized implementation enables genome-wide association studies (GWAS) on encrypted data with computational overhead of only 15× compared to plaintext analysis, a 50× improvement over previous approaches. Evaluated on the UK Biobank dataset (500,000 participants, 800,000 variants), GenomeCrypt identifies the same significant associations as plaintext GWAS with zero information leakage. The framework supports multi-institutional collaboration without raw data exchange, enabling federated GWAS across 7 international biobanks.',
      keywords: 'homomorphic encryption, genomics, privacy, precision medicine, data sharing, bioinformatics',
      doi: '10.55001/gij.2025.04.002',
      page_start: 35,
      page_end: 60,
      submission_date: new Date('2025-07-22'),
      acceptance_date: new Date('2025-09-30'),
      author_ids: [13, 17, 2],
      corresponding: 0,
    },
    {
      issue_idx: 3,
      title: 'Algorithmic Bias in Criminal Justice Risk Assessment: A Cross-National Comparative Study',
      abstract:
        'Risk assessment instruments (RAIs) powered by machine learning algorithms are widely adopted in criminal justice systems, yet concerns about racial and socioeconomic bias persist. This cross-national study evaluates six commercially deployed RAIs across the United States, United Kingdom, and Australia using data from 850,000 case records. Our analysis reveals significant disparities: prediction error rates are 1.5-2.3× higher for minority populations across all systems examined. We develop a novel fairness-aware recalibration method (FAIR-CAL) that reduces demographic parity gaps by 60% while maintaining predictive accuracy within 3% of original models. Policy recommendations for algorithmic auditing mandates and transparency requirements are presented.',
      keywords: 'algorithmic bias, criminal justice, fairness, machine learning, risk assessment, AI ethics',
      doi: '10.55001/gij.2025.04.003',
      page_start: 61,
      page_end: 88,
      submission_date: new Date('2025-08-05'),
      acceptance_date: new Date('2025-10-01'),
      author_ids: [4, 18, 9],
      corresponding: 0,
    },

    // ── Vol 2, Issue 2 ──
    {
      issue_idx: 4,
      title: 'Bioprinted Vascularized Cardiac Patches for Myocardial Infarction Repair: Preclinical Validation',
      abstract:
        'Myocardial infarction (MI) remains a leading cause of mortality worldwide, with limited regenerative treatment options. This study presents the development and preclinical validation of 3D bioprinted vascularized cardiac patches using a novel bioink formulation combining decellularized cardiac extracellular matrix (dECM), gelatin methacrylate (GelMA), and patient-derived induced pluripotent stem cell (iPSC) cardiomyocytes. The bioprinted patches demonstrate synchronized beating within 7 days post-fabrication and develop functional microvasculature within 14 days. In a porcine MI model (n = 24), patch implantation improved left ventricular ejection fraction by 18.5% and reduced infarct size by 42% at 12 weeks compared to controls. Immunological analysis confirms minimal rejection with autologous iPSC-derived cells.',
      keywords: 'bioprinting, cardiac tissue engineering, myocardial infarction, stem cells, vascularization, regenerative medicine',
      doi: '10.55001/gij.2026.01.001',
      page_start: 1,
      page_end: 32,
      submission_date: new Date('2025-10-15'),
      acceptance_date: new Date('2025-12-20'),
      author_ids: [1, 19, 3],
      corresponding: 0,
    },
    {
      issue_idx: 4,
      title: 'Neuromorphic Computing for Edge Intelligence: Energy-Efficient Spiking Neural Network Accelerators',
      abstract:
        'The proliferation of edge computing devices demands ultra-low-power AI inference capabilities. This paper presents NeuroEdge, a novel neuromorphic computing architecture implementing spiking neural networks (SNNs) on a custom 7nm ASIC designed for edge AI applications. NeuroEdge achieves 15.8 TOPS/W energy efficiency — 50× improvement over conventional GPU-based inference — while maintaining 92.4% accuracy on ImageNet classification and 97.1% on keyword spotting tasks. The architecture employs a biologically-inspired spike-timing-dependent plasticity (STDP) learning rule enabling on-chip adaptation. Manufactured prototypes demonstrate real-time processing of 8 camera streams simultaneously with total power consumption under 500mW, enabling always-on AI in battery-powered IoT devices.',
      keywords: 'neuromorphic computing, spiking neural networks, edge AI, energy efficiency, ASIC design, IoT',
      doi: '10.55001/gij.2026.01.002',
      page_start: 33,
      page_end: 58,
      submission_date: new Date('2025-10-28'),
      acceptance_date: new Date('2025-12-28'),
      author_ids: [10, 14, 6],
      corresponding: 0,
    },
    {
      issue_idx: 4,
      title: 'AI-Guided Antibiotic Discovery: Targeting Multi-Drug Resistant Gram-Negative Bacteria',
      abstract:
        'The global antibiotic resistance crisis demands innovative approaches to drug discovery. This paper presents DeepAntibiotic, a generative AI pipeline combining variational autoencoders (VAE), molecular dynamics simulations, and reinforcement learning to design novel antibiotic compounds targeting multi-drug resistant (MDR) Gram-negative bacteria. Screening 12 million virtual compounds, our pipeline identified 23 candidates with predicted activity against Acinetobacter baumannii and Pseudomonas aeruginosa. Experimental validation confirmed potent bactericidal activity (MIC < 2 μg/mL) for 8 compounds, with 3 showing novel mechanisms of action targeting the bacterial outer membrane. Lead compound DA-7 demonstrated 100% survival in a murine septicemia model at 10 mg/kg and favorable ADMET properties, advancing to IND-enabling studies.',
      keywords: 'antibiotic discovery, artificial intelligence, drug resistance, generative models, Gram-negative bacteria, drug design',
      doi: '10.55001/gij.2026.01.003',
      page_start: 59,
      page_end: 86,
      submission_date: new Date('2025-11-05'),
      acceptance_date: new Date('2026-01-03'),
      author_ids: [12, 2, 17],
      corresponding: 1,
    },
    {
      issue_idx: 4,
      title: 'Digital Twin Framework for Smart Manufacturing: Integration of IoT, AI, and Blockchain',
      abstract:
        'Digital twins represent a transformative paradigm for smart manufacturing, yet challenges persist in real-time data integration, predictive accuracy, and supply chain transparency. This paper proposes SmartTwin, a comprehensive digital twin framework integrating Internet of Things (IoT) sensor networks, physics-informed neural networks (PINNs), and blockchain-based supply chain tracking. Deployed across 3 manufacturing plants producing automotive components, SmartTwin achieved 96.8% predictive maintenance accuracy (24-hour horizon), reduced unplanned downtime by 73%, and improved overall equipment effectiveness (OEE) by 18.5%. The blockchain layer provides immutable provenance tracking for 15,000+ components daily with transaction finality under 2 seconds. Total cost savings exceeded $4.2M annually across pilot facilities.',
      keywords: 'digital twin, smart manufacturing, IoT, artificial intelligence, blockchain, predictive maintenance',
      doi: '10.55001/gij.2026.01.004',
      page_start: 87,
      page_end: 112,
      submission_date: new Date('2025-11-12'),
      acceptance_date: new Date('2026-01-05'),
      author_ids: [7, 11, 15],
      corresponding: 0,
    },

    // ══════════════════════════════════════════════════════════
    //  VOLUME 5  (2025)  —  Issue 1: Machine Learning Foundations
    // ══════════════════════════════════════════════════════════
    {
      issue_idx: 5,
      title: 'Attention Is All You Still Need: A Decade of Transformer Evolution in Natural Language Processing',
      abstract:
        'This retrospective survey examines ten years of transformer-based research in natural language processing, cataloguing over 350 architectures from the original attention mechanism to sparse, linear, and hierarchical variants. We conduct a large-scale meta-analysis across 48 benchmark datasets, revealing that scale-agnostic improvements in positional encoding and attention sparsity account for 64% of the performance gains independent of parameter count. We introduce a unified taxonomy of transformer innovations and empirically evaluate representative models on tasks spanning machine translation, summarisation, code generation, and multilingual reasoning. Our analysis identifies diminishing returns at extreme scale and highlights efficiency techniques — including mixture-of-experts routing and token merging — as the most promising avenues for the next decade of language model research.',
      keywords: 'transformers, natural language processing, attention mechanisms, survey, large language models, NLP benchmarks',
      doi: '10.55001/gij.v5.01.001',
      page_start: 1,
      page_end: 28,
      submission_date: new Date('2024-10-08'),
      acceptance_date: new Date('2024-12-18'),
      author_ids: [0, 14, 23],
      corresponding: 0,
    },
    {
      issue_idx: 5,
      title: 'AutoML vs. Human Experts: A Comprehensive Benchmark on Diverse Tabular Datasets',
      abstract:
        'Automated machine learning (AutoML) promises to democratise predictive modelling by replacing hand-crafted feature engineering and hyperparameter tuning. This paper provides the most comprehensive head-to-head comparison to date, pitting seven leading AutoML frameworks (Auto-Sklearn, TPOT, H2O AutoML, AutoGluon, FLAML, NAS-Bench-360, and TabPFN) against 40 domain experts across 120 tabular datasets drawn from medical, financial, environmental, and industrial domains. AutoML systems match expert performance on 68% of datasets and surpass experts on 21%, particularly on high-dimensional problems with complex feature interactions. Experts retain an advantage in small-sample regimes (n < 500) and when domain knowledge constrains the hypothesis space. We release a public leaderboard and reproducibility artefacts to support ongoing benchmarking.',
      keywords: 'AutoML, hyperparameter optimisation, neural architecture search, tabular data, benchmark, machine learning',
      doi: '10.55001/gij.v5.01.002',
      page_start: 29,
      page_end: 54,
      submission_date: new Date('2024-10-22'),
      acceptance_date: new Date('2024-12-30'),
      author_ids: [10, 29, 13],
      corresponding: 0,
    },
    {
      issue_idx: 5,
      title: 'Continual Learning Without Catastrophic Forgetting: Methods, Benchmarks, and Open Challenges',
      abstract:
        'Catastrophic forgetting — the tendency of neural networks to overwrite previously acquired knowledge when learning new tasks — remains a fundamental obstacle to lifelong machine learning. This survey systematically reviews 180 continual learning methods published between 2015 and 2025, organising them into regularisation, replay, parameter-isolation, and architecture-expansion families. We introduce CL-Bench, a unified evaluation protocol spanning seven task sequences from image classification, object detection, and NLP, enabling fair cross-method comparison for the first time. Empirical results on CL-Bench reveal that hybrid approaches combining selective replay with dynamic sparse networks achieve the best stability-plasticity trade-off, retaining 91.4% of initial task performance after 20 sequential tasks. We identify evaluation inconsistencies in the literature and specify six open research challenges including backward transfer, zero-shot generalisation, and energy efficiency.',
      keywords: 'continual learning, catastrophic forgetting, lifelong learning, regularisation, replay, benchmark',
      doi: '10.55001/gij.v5.01.003',
      page_start: 55,
      page_end: 80,
      submission_date: new Date('2024-11-05'),
      acceptance_date: new Date('2025-01-08'),
      author_ids: [2, 20, 6],
      corresponding: 1,
    },
    {
      issue_idx: 5,
      title: 'Cross-Domain Few-Shot Learning for Medical Image Segmentation in Low-Resource Clinical Settings',
      abstract:
        'Medical image segmentation systems trained on large annotated datasets often fail when deployed across institutions with different scanning protocols, patient demographics, or imaging equipment. This paper presents MedFSS, a cross-domain few-shot segmentation framework that adapts to a new target domain using as few as five labelled support images. Our approach combines domain-agnostic feature extraction via multi-scale prototype alignment with a lightweight domain-shift adapter trained with meta-learning. Evaluated on seven segmentation tasks spanning CT, MRI, and ultrasound modalities across four institution-level domain shifts, MedFSS achieves a mean Dice coefficient of 0.814 — a 17.3% improvement over the strongest baseline — while requiring no target-domain retraining. Ablation studies confirm that prototype alignment contributes the majority of cross-domain robustness gains.',
      keywords: 'few-shot learning, medical image segmentation, domain adaptation, meta-learning, deep learning, clinical AI',
      doi: '10.55001/gij.v5.01.004',
      page_start: 81,
      page_end: 104,
      submission_date: new Date('2024-11-18'),
      acceptance_date: new Date('2025-01-15'),
      author_ids: [9, 35, 24],
      corresponding: 0,
    },
    {
      issue_idx: 5,
      title: 'Diffusion Models for Multivariate Time Series Generation: Architecture Design and Evaluation Framework',
      abstract:
        'Score-based diffusion models have demonstrated remarkable fidelity in image and audio generation, yet their application to multivariate time series remains underexplored. This paper introduces TimeDiff, a conditional diffusion architecture incorporating temporal attention and cross-variate dependency injection specifically designed for irregular, high-dimensional time series. We address three practical challenges: handling missing values during the noising process, conditioning on covariates without information leakage, and controlling diversity-fidelity trade-offs at inference. Evaluated on five real-world datasets from finance, energy, healthcare wearables, climate sensors, and industrial manufacturing, TimeDiff outperforms GAN- and VAE-based baselines on discriminative score, context-FID, and downstream imputation accuracy by margins of 8–23%. A companion evaluation toolkit supporting 11 generation quality metrics is publicly released.',
      keywords: 'diffusion models, time series generation, score-based models, multivariate data, generative AI, temporal modelling',
      doi: '10.55001/gij.v5.01.005',
      page_start: 105,
      page_end: 130,
      submission_date: new Date('2024-12-01'),
      acceptance_date: new Date('2025-01-20'),
      author_ids: [14, 30, 1],
      corresponding: 0,
    },

    // ── Vol 5, Issue 2: Climate Science and Environmental Engineering ──
    {
      issue_idx: 6,
      title: 'Permafrost Thaw Feedback Loops: Quantifying Methane Emissions Using Satellite Remote Sensing Networks',
      abstract:
        'Thawing Arctic and sub-Arctic permafrost represents one of the most uncertain components of the global carbon budget, yet ground-based methane flux measurements remain sparse across the vast boreal and tundra landscapes. This study integrates three satellite platforms — GOSAT-2, Sentinel-5P TROPOMI, and ICESat-2 surface subsidence data — with a process-based permafrost model to produce the first continent-scale, 1 km resolution methane emission inventory for 2018–2024. We detect a statistically significant acceleration in thaw subsidence of 2.3 cm yr⁻¹ in the Western Siberian Lowlands and quantify a 34% increase in growing-season methane flux compared to the 2000–2010 baseline. Monte Carlo uncertainty propagation estimates the net Arctic permafrost feedback at 0.16–0.38 PgC yr⁻¹ under RCP 4.5, rising to 0.41–0.79 PgC yr⁻¹ under RCP 8.5 by 2050.',
      keywords: 'permafrost, methane emissions, remote sensing, Arctic, climate feedback, carbon cycle',
      doi: '10.55001/gij.v5.02.001',
      page_start: 1,
      page_end: 26,
      submission_date: new Date('2024-11-10'),
      acceptance_date: new Date('2025-01-22'),
      author_ids: [5, 26, 33],
      corresponding: 0,
    },
    {
      issue_idx: 6,
      title: 'Ocean Acidification and Coral Reef Calcification: A Longitudinal Analysis Across Indo-Pacific Atolls',
      abstract:
        'Ocean acidification driven by rising atmospheric CO₂ threatens the calcification capacity of coral reefs, yet long-term observational datasets spanning both chemistry and calcification biology remain limited. This study presents a 22-year time-series (2002–2024) of simultaneous carbonate chemistry, skeletal growth, and community composition from 18 atolls across the Indo-Pacific spanning oligotrophic to eutrophic gradients. Linear mixed-effects modelling reveals a significant negative relationship between aragonite saturation state (Ωarag) and coral extension rates: every 0.1-unit decrease in Ωarag is associated with a 4.2% reduction in annual linear extension. Bleaching events interact synergistically with acidification, doubling calcification suppression relative to acidification alone. Our findings project that 73% of monitored reefs will experience calcification net losses by 2060 under current emission trajectories, emphasising the need for combined emissions and local stressor reduction strategies.',
      keywords: 'ocean acidification, coral reefs, calcification, Indo-Pacific, carbonate chemistry, climate change',
      doi: '10.55001/gij.v5.02.002',
      page_start: 27,
      page_end: 52,
      submission_date: new Date('2024-11-25'),
      acceptance_date: new Date('2025-01-30'),
      author_ids: [15, 7, 34],
      corresponding: 1,
    },
    {
      issue_idx: 6,
      title: 'Ensemble Machine Learning for Regional Wildfire Risk Prediction Using High-Resolution Weather and Fuel Data',
      abstract:
        'Accurate operational wildfire risk prediction is essential for pre-positioning suppression resources and issuing timely evacuation warnings. This study develops WildfireEnsemble, a stacked ensemble model combining gradient-boosted trees, random forests, and a spatiotemporal convolutional LSTM, trained on 15 years of fire occurrence records, daily 1 km weather reanalysis, fuel moisture maps, and topographic indices across California, Southern Europe, and south-eastern Australia. The ensemble achieves an area under the ROC curve of 0.944 for 7-day-ahead large-fire probability at the 10 km grid scale, outperforming the operational Canadian Fire Weather Index by 18.6 AUC points. Permutation feature importance identifies fuel dryness, wind speed, and antecedent drought index as the three most critical predictors. Model outputs are integrated into an operational web dashboard with real-time updating and uncertainty visualisation.',
      keywords: 'wildfire prediction, ensemble machine learning, fire weather, convolutional LSTM, risk assessment, forest fire',
      doi: '10.55001/gij.v5.02.003',
      page_start: 53,
      page_end: 76,
      submission_date: new Date('2024-12-08'),
      acceptance_date: new Date('2025-02-05'),
      author_ids: [8, 36, 5],
      corresponding: 0,
    },
    {
      issue_idx: 6,
      title: 'Blue Carbon Ecosystems as Nature-Based Climate Solutions: A Global Inventory and Economic Valuation',
      abstract:
        'Mangroves, tidal marshes, and seagrass meadows sequester carbon at rates 10–50 times greater per unit area than terrestrial forests, yet remain underrepresented in national greenhouse gas inventories. This study compiles the most comprehensive global assessment to date of blue carbon ecosystem extent, carbon stock density, and ecosystem service values, drawing on 2,100 site-level measurements harmonised into spatially explicit maps at 30 m resolution. Total global blue carbon stock is estimated at 9.8 ± 2.1 PgC with an annual sequestration flux of 0.18–0.35 PgC yr⁻¹. Economic valuation using a social cost of carbon of $51 t⁻¹ CO₂ yields total avoided-emission value of $340–660 billion globally. Scenario analysis demonstrates that protecting and restoring 20% of currently degraded blue carbon areas would deliver GHG benefits equivalent to retiring 620 million passenger cars annually.',
      keywords: 'blue carbon, mangroves, seagrass, tidal marshes, nature-based solutions, climate change mitigation',
      doi: '10.55001/gij.v5.02.004',
      page_start: 77,
      page_end: 102,
      submission_date: new Date('2024-12-20'),
      acceptance_date: new Date('2025-02-12'),
      author_ids: [16, 25, 35],
      corresponding: 0,
    },
    {
      issue_idx: 6,
      title: 'Enhanced Rock Weathering for Agricultural CO₂ Removal: Three-Year Field Trial and Life Cycle Assessment',
      abstract:
        'Enhanced rock weathering (ERW) — spreading finely ground silicate rocks on agricultural soils — accelerates natural mineral weathering to remove atmospheric CO₂ and replenishes soil nutrients. This paper reports results from a randomised controlled field trial spanning 42 plots across seven farms in Bangladesh, Brazil, and the United Kingdom over three growing seasons (2022–2024). Application of basalt at 10 t ha⁻¹ yr⁻¹ removed a net 3.7 ± 0.8 tCO₂ ha⁻¹ yr⁻¹ after accounting for application emissions, while simultaneously increasing maize yields by 9.4% and wheat yields by 7.1% through silica and micronutrient supply. A cradle-to-gate life cycle assessment identifies rock mining and grinding as the dominant emission sources, contributing 0.31 tCO₂ t⁻¹ rock, and outlines a mineralogy-optimised quarry-to-field pathway that could reduce process-chain emissions by 40%.',
      keywords: 'enhanced rock weathering, carbon dioxide removal, agricultural soils, basalt, life cycle assessment, CDR',
      doi: '10.55001/gij.v5.02.005',
      page_start: 103,
      page_end: 126,
      submission_date: new Date('2025-01-06'),
      acceptance_date: new Date('2025-02-20'),
      author_ids: [12, 31, 28],
      corresponding: 1,
    },

    // ── Vol 5, Issue 3: Biomedical Sciences and Healthcare Technology ──
    {
      issue_idx: 7,
      title: 'Personalised Cancer Immunotherapy Using mRNA Neoantigen Vaccines: Phase I/II Trial Results',
      abstract:
        'Tumour-specific neoantigens arising from somatic mutations are ideal targets for personalised immunotherapy, yet rapid vaccine manufacturing at clinical scale has historically been prohibitive. This paper reports outcomes from a Phase I/II trial (NCT05438291) of mRNA-based neoantigen vaccines in 38 patients with resected stage III/IV melanoma, non-small-cell lung cancer, and bladder cancer. Whole-exome sequencing and HLA typing guided neoantigen prioritisation using pMHC binding prediction; mRNA vaccines were manufactured within 28 days of biopsy. T-cell responses against vaccine-encoded neoantigens were observed in 92% of patients, and objective response rate was 36.8%. Median progression-free survival was 14.6 months compared to 8.2 months in contemporaneous matched controls. Grade 3–4 adverse events were limited to 10.5% of patients, predominantly transient injection-site reactions. Correlative analyses identify clonal neoantigen burden and CD8⁺/Treg ratio as predictive biomarkers.',
      keywords: 'mRNA vaccine, neoantigen, cancer immunotherapy, personalised medicine, clinical trial, checkpoint inhibitor',
      doi: '10.55001/gij.v5.03.001',
      page_start: 1,
      page_end: 28,
      submission_date: new Date('2024-12-15'),
      acceptance_date: new Date('2025-02-22'),
      author_ids: [1, 19, 38],
      corresponding: 0,
    },
    {
      issue_idx: 7,
      title: 'Continuous Glucose Monitoring Paired with Deep Learning for Hypoglycaemia Prediction in Type 1 Diabetes',
      abstract:
        'Severe hypoglycaemia is the leading acute complication of intensive insulin therapy in Type 1 diabetes, causing cognitive impairment and, in extreme cases, death. This study combines continuous glucose monitoring (CGM) data streams with patient-reported meal logs, activity tracker data, and sleep quality indices to train a bidirectional LSTM model predicting hypoglycaemic events 60 minutes in advance. The model was developed on 312 patients from three European diabetes centres (total: 4.8 million glucose readings) and validated prospectively on a held-out cohort of 88 patients over six months. Sensitivity for predicting hypoglycaemia (BG < 3.9 mmol/L) was 94.1% with a specificity of 97.6% and false-alarm rate of 0.8 per patient-day. Integration with a smartphone alert system reduced clinical hypoglycaemic events by 46% compared to standard threshold alarms (p < 0.001). Total daily insulin dose remained unchanged, confirming safety of the alert-based intervention.',
      keywords: 'continuous glucose monitoring, deep learning, hypoglycaemia prediction, Type 1 diabetes, LSTM, wearable technology',
      doi: '10.55001/gij.v5.03.002',
      page_start: 29,
      page_end: 54,
      submission_date: new Date('2025-01-08'),
      acceptance_date: new Date('2025-03-05'),
      author_ids: [3, 29, 22],
      corresponding: 1,
    },
    {
      issue_idx: 7,
      title: 'Gut Microbiome Dysbiosis in Major Depressive Disorder: Causal Inference via Two-Sample Mendelian Randomisation',
      abstract:
        'Observational studies consistently report differences in gut microbiome composition between individuals with major depressive disorder (MDD) and healthy controls, yet the causal direction of this association remains contested. This study applies two-sample Mendelian randomisation (MR) using bacterial abundance genome-wide association study (GWAS) data from the MiBioGen consortium (n = 18,340) and MDD summary statistics from the Psychiatric Genomics Consortium (n = 807,553). Inverse-variance weighted MR analysis identifies genus-level causal effects: genetically predicted higher abundance of Bifidobacterium (OR 0.84, 95% CI 0.76–0.92) and Lactobacillus (OR 0.89, 95% CI 0.82–0.97) are associated with lower MDD risk, while elevated Alistipes (OR 1.21, 95% CI 1.09–1.35) increases risk. Bidirectional MR finds no evidence of reverse causation. Our findings support the gut-brain axis as a causal pathway and nominate dietary modulation of the microbiome as a candidate intervention for depression prevention.',
      keywords: 'gut microbiome, major depressive disorder, Mendelian randomisation, gut-brain axis, microbiota, mental health',
      doi: '10.55001/gij.v5.03.003',
      page_start: 55,
      page_end: 78,
      submission_date: new Date('2025-01-20'),
      acceptance_date: new Date('2025-03-15'),
      author_ids: [11, 27, 37],
      corresponding: 0,
    },
    {
      issue_idx: 7,
      title: 'Robotic-Assisted Minimally Invasive Surgery: An Updated Meta-Analysis of 50 Randomised Controlled Trials',
      abstract:
        'Robotic-assisted surgery (RAS) has expanded rapidly across surgical specialty, yet its superiority over conventional laparoscopic approaches remains debated. This updated systematic review and meta-analysis includes 50 randomised controlled trials (9,412 patients) published between 2010 and 2024, spanning colorectal, gynaecological, urological, and thoracic procedures. Random-effects pooled analysis reveals that RAS reduces intraoperative blood loss by a mean difference of −52 mL (95% CI −78 to −26 mL), shortens hospitalisation by 0.9 days (95% CI 0.5–1.3 days), and lowers conversion rate to open surgery by 48% (OR 0.52, 95% CI 0.38–0.71). Oncological resection margin adequacy and 30-day complication rates are statistically equivalent between RAS and conventional laparoscopy. Sensitivity analyses confirm findings are robust to heterogeneity (I² = 38%) and publication bias. Economic modelling suggests that at volume thresholds above 150 procedures per year, RAS achieves cost-neutrality compared to advanced laparoscopic equipment.',
      keywords: 'robotic surgery, laparoscopy, meta-analysis, surgical outcomes, minimally invasive surgery, RAS',
      doi: '10.55001/gij.v5.03.004',
      page_start: 79,
      page_end: 104,
      submission_date: new Date('2025-01-30'),
      acceptance_date: new Date('2025-03-22'),
      author_ids: [17, 24, 34],
      corresponding: 0,
    },
    {
      issue_idx: 7,
      title: 'Deep Learning Detection of Early Alzheimer\'s Disease from Retinal Fundus Photography',
      abstract:
        'The retina shares embryological and structural characteristics with the central nervous system, making retinal imaging a potentially non-invasive window onto neurodegenerative changes in Alzheimer\'s disease (AD). This study develops RetinaAD, a multi-task convolutional-transformer network trained on fundus photographs from 22,641 participants in the UK Biobank, of whom 1,347 received an AD diagnosis during six-year follow-up. The model predicts five-year AD conversion with AUROC 0.817 (95% CI 0.793–0.841), substantially outperforming models using age, sex, APOE4 genotype, and cognitive screening alone (AUROC 0.748). Saliency mapping identifies peripapillary nerve fibre layer thinning, arteriolar narrowing, and drusen density as the most predictive retinal features. External validation on an independent Australian cohort (n = 5,204) yields AUROC 0.801, confirming generalisability. RetinaAD represents a low-cost, high-throughput screening pathway ahead of CSF or PET-based biomarkers.',
      keywords: 'Alzheimer\'s disease, retinal fundus, deep learning, early detection, neurodegeneration, biomarker',
      doi: '10.55001/gij.v5.03.005',
      page_start: 105,
      page_end: 128,
      submission_date: new Date('2025-02-10'),
      acceptance_date: new Date('2025-03-28'),
      author_ids: [0, 39, 30],
      corresponding: 0,
    },

    // ── Vol 5, Issue 4: Social Sciences and Digital Humanities ──
    {
      issue_idx: 8,
      title: 'Automated Misinformation Detection on Social Media During Health Emergencies: A Multi-Language Comparative Analysis',
      abstract:
        'Health misinformation on social media platforms accelerates during public health emergencies, contributing to vaccine hesitancy, treatment delays, and erosion of institutional trust. This paper presents InfoShield, a multi-lingual misinformation detection system trained on a novel annotated corpus of 1.3 million posts across Twitter, Facebook, and Telegram in English, Arabic, French, Swahili, and Indonesian during the COVID-19 and 2024 mpox outbreaks. The system combines cross-lingual BERT embeddings with knowledge-graph grounding against WHO-validated health facts and network propagation features. Macro-F1 score reaches 0.893 across languages, a 14.6-point improvement over monolingual baselines. Temporal analysis reveals that misinformation narratives peak 3–5 days before official institutional communications, identifying a critical intervention window. False positive rates for satire and legitimate health debate remain below 3%.',
      keywords: 'misinformation, social media, health communication, multi-lingual NLP, fact-checking, infodemic',
      doi: '10.55001/gij.v5.04.001',
      page_start: 1,
      page_end: 26,
      submission_date: new Date('2025-01-15'),
      acceptance_date: new Date('2025-03-20'),
      author_ids: [4, 31, 35],
      corresponding: 0,
    },
    {
      issue_idx: 8,
      title: 'Remote Work and Urban Spatial Restructuring: Evidence from GPS Mobility Data Across 30 Metropolitan Areas',
      abstract:
        'The widespread adoption of remote and hybrid work arrangements following the COVID-19 pandemic has disrupted established commuting patterns and urban land-use dynamics. This study analyses anonymised GPS mobility data from 18 million mobile devices across 30 major metropolitan areas in North America, Europe, and Asia, covering the period 2019–2024. Difference-in-differences analysis reveals a persistent 31% reduction in peak-hour CBD visits even after controlling for economic recovery, driven disproportionately by knowledge-worker sectors. Suburbanisation of residential moves has increased 22% compared to 2018–2019 baselines; however, this effect is concentrated among households with incomes above the 70th percentile. Agent-based urban models calibrated on observed mobility suggest that sustained hybrid work could reduce CBD commercial real-estate values by 12–24% by 2030 while raising suburban residential prices by 8–15%, with important implications for municipal tax revenues and public transit viability.',
      keywords: 'remote work, urban mobility, GPS data, suburbanisation, commercial real estate, post-pandemic cities',
      doi: '10.55001/gij.v5.04.002',
      page_start: 27,
      page_end: 52,
      submission_date: new Date('2025-01-28'),
      acceptance_date: new Date('2025-03-30'),
      author_ids: [8, 21, 36],
      corresponding: 1,
    },
    {
      issue_idx: 8,
      title: 'AI-Powered Digitisation of Historical Manuscripts: Accuracy, Representation Bias, and Cultural Heritage Implications',
      abstract:
        'Millions of historical manuscripts remain inaccessible due to degradation, obscure scripts, and under-resourced archives. This paper evaluates transformer-based optical character recognition (OCR) and handwritten text recognition (HTR) pipelines applied to 650,000 documents from 12 national archives spanning Arabic, Hebrew, Ottoman Turkish, Classical Chinese, and Medieval Latin scripts. End-to-end character error rates average 3.2% for digitally acquired documents and 7.8% for photographic reproductions of damaged parchment. Systematic analysis uncovers representation bias: error rates are 2.9× higher for scripts from Global South collections compared to Latin-script European collections, traceable to an 8:1 training data imbalance. We release a 45-language benchmark corpus and propose a participatory AI-archiving framework that prioritises community-controlled annotation to redress historical inequities in heritage preservation.',
      keywords: 'digital humanities, OCR, handwritten text recognition, cultural heritage, historical manuscripts, representation bias',
      doi: '10.55001/gij.v5.04.003',
      page_start: 53,
      page_end: 76,
      submission_date: new Date('2025-02-05'),
      acceptance_date: new Date('2025-04-08'),
      author_ids: [18, 28, 39],
      corresponding: 0,
    },
    {
      issue_idx: 8,
      title: 'Algorithmic Management and Platform Workers\' Rights: A Comparative Legal Analysis Across 15 Jurisdictions',
      abstract:
        'Ride-hailing, food-delivery, and on-demand professional services increasingly rely on opaque algorithmic systems to assign tasks, set prices, evaluate performance, and deactivate workers. This paper provides the first systematic comparative legal analysis of platform worker rights under algorithmic management regimes across 15 jurisdictions, including the EU, United States, United Kingdom, Brazil, India, Nigeria, and South Korea. We analyse 340 regulatory instruments, court decisions, and collective bargaining agreements using mixed-methods doctrinal and socio-legal methods. Key findings reveal a divergence between jurisdictions adopting algorithmic transparency mandates (EU AI Act, Spanish Riders\' Law) and those relying on existing employment classification litigation. We identify five regulatory typologies and develop a Platform Worker Rights Index (PWRI) scoring transparency, contestability, income security, and portability dimensions. Policy recommendations address minimum information disclosure, algorithmic auditing requirements, and cooperative ownership models.',
      keywords: 'gig economy, algorithmic management, labour law, platform workers, comparative law, digital work',
      doi: '10.55001/gij.v5.04.004',
      page_start: 77,
      page_end: 100,
      submission_date: new Date('2025-02-18'),
      acceptance_date: new Date('2025-04-15'),
      author_ids: [9, 25, 20],
      corresponding: 0,
    },
    {
      issue_idx: 8,
      title: 'Youth Civic Engagement in the Digital Age: A 20-Country Survey with Four-Year Longitudinal Follow-Up',
      abstract:
        'Democratic backsliding across numerous countries has revived scholarly interest in youth political participation, yet large-scale longitudinal studies spanning diverse democratic contexts remain scarce. This paper reports findings from the Global Youth Civic Survey (GYCS), tracking 47,200 respondents aged 16–29 across 20 countries from 2021 to 2024 in four annual waves. Structural equation modelling reveals that digital media literacy, perceived institutional responsiveness, and peer civic norms collectively explain 54% of variance in political participation intent. Social media use has a non-linear effect: moderate engagement correlates with higher offline participation, while high-frequency use is associated with political disengagement. Country-level fixed effects show that proportional representation systems yield 18% higher youth turnout intention than first-past-the-post systems, independent of individual-level predictors. Climate change concern is the strongest issue-specific predictor of participation across income groups.',
      keywords: 'youth civic engagement, political participation, digital media, longitudinal survey, democracy, social media',
      doi: '10.55001/gij.v5.04.005',
      page_start: 101,
      page_end: 126,
      submission_date: new Date('2025-03-02'),
      acceptance_date: new Date('2025-04-22'),
      author_ids: [13, 26, 15],
      corresponding: 1,
    },

    // ── Vol 5, Issue 5: Quantum Computing and Advanced Materials ──
    {
      issue_idx: 9,
      title: 'Reproducibility of Ambient-Pressure Superconductivity in Nitrogen-Doped Lutetium Hydride: Multi-Laboratory Assessment',
      abstract:
        'Reports of room-temperature superconductivity in lutetium hydride compounds generated intense scientific interest and controversy in 2023–2024. This paper presents results from a coordinated multi-laboratory reproducibility study conducted across eight research institutions in Germany, South Korea, Japan, and the United States. Using independently synthesised LuH₂±ₓNᵧ samples prepared via three different high-pressure synthesis routes and characterised by X-ray diffraction, neutron scattering, and four-probe resistance measurements, we confirm metallic conductivity in all samples but find a distribution of apparent critical temperatures between 160 K and 294 K with a median of 218 K. Critical current density and Meissner effect measurements consistent with bulk superconductivity are replicated in 4 of 8 institutions. We identify nitrogen incorporation gradient and hydrogen stoichiometry as the primary variables explaining inter-sample variation, and provide synthesis protocols that improve cross-laboratory reproducibility by 55%.',
      keywords: 'superconductivity, lutetium hydride, room temperature, reproducibility, condensed matter, high pressure',
      doi: '10.55001/gij.v5.05.001',
      page_start: 1,
      page_end: 28,
      submission_date: new Date('2025-02-10'),
      acceptance_date: new Date('2025-04-18'),
      author_ids: [3, 22, 33],
      corresponding: 0,
    },
    {
      issue_idx: 9,
      title: 'Fault-Tolerant Quantum Error Correction on 100-Qubit Trapped-Ion Processors: Surface Code Implementation',
      abstract:
        'Achieving fault-tolerant quantum computation requires physical error rates well below the surface code threshold (~1%) and scalable syndrome extraction at high speed. This paper reports implementation of the distance-5 surface code on a fully connected 100-qubit ⁷¹Yb⁺ trapped-ion processor with two-qubit gate fidelities of 99.7% and single-qubit fidelities of 99.95%. Logical qubit error rate per round is measured as (3.1 ± 0.4) × 10⁻⁴, representing a 12× improvement over the physical error rate and confirming operation below the fault-tolerance threshold. We introduce a real-time classical decoder based on a minimum-weight perfect matching algorithm running on FPGAs with 15 μs classical latency, compatible with ion-trap cycle times. Scaling projections indicate that 1,000-qubit arrays with current noise levels can support quantum advantage circuits for Hamiltonian simulation within this decade.',
      keywords: 'quantum error correction, surface code, trapped-ion, fault tolerance, quantum computing, qubits',
      doi: '10.55001/gij.v5.05.002',
      page_start: 29,
      page_end: 56,
      submission_date: new Date('2025-02-24'),
      acceptance_date: new Date('2025-04-28'),
      author_ids: [9, 30, 14],
      corresponding: 0,
    },
    {
      issue_idx: 9,
      title: 'Zirconium-Based Metal-Organic Frameworks for Direct Air Carbon Capture: Scalability, Cycling Stability, and Cost Analysis',
      abstract:
        'Direct air capture (DAC) is increasingly viewed as a necessary complement to emissions reductions, but sorbent materials must achieve high CO₂ selectivity, rapid regeneration, and long cycle stability at low energy cost. This paper evaluates amino-functionalised Zr-MOF sorbents (UiO-66-NH₂ and NU-1000-NH₂ derivatives) for DAC under simulated ambient conditions (400 ppm CO₂, 50% RH, 25°C). Breakthrough column experiments at bench scale show CO₂ uptake capacities of 2.8–3.4 mmol g⁻¹ with > 95% retention after 5,000 adsorption-desorption cycles at 80°C regeneration temperature. Pilot-scale modules (1 m² cross-section) achieving 90 tCO₂ yr⁻¹ were deployed and monitored over 18 months. Techno-economic modelling at 1 MtCO₂ yr⁻¹ scale projects costs of $210–290 t⁻¹ CO₂ with renewable electricity, falling below $150 t⁻¹ by 2035 with anticipated material and process learning rates — competitive with early liquid-solvent DAC plants.',
      keywords: 'metal-organic framework, direct air capture, carbon dioxide removal, MOF sorbent, negative emissions, techno-economics',
      doi: '10.55001/gij.v5.05.003',
      page_start: 57,
      page_end: 80,
      submission_date: new Date('2025-03-08'),
      acceptance_date: new Date('2025-05-05'),
      author_ids: [6, 23, 38],
      corresponding: 1,
    },
    {
      issue_idx: 9,
      title: 'Majorana Zero-Mode Evidence in Epitaxial Al-InAs Nanowire Devices: Tunnelling Spectroscopy and Scaling Analysis',
      abstract:
        'Majorana zero modes (MZMs) hosted at the ends of topological superconductor nanowires are promising building blocks for topologically protected qubits. Despite extensive experimental effort, unambiguous demonstration in solid-state devices has proved elusive due to disorder and quasi-particle poisoning. This paper reports tunnelling spectroscopy measurements on high-purity Al-InAs nanowire devices fabricated by molecular beam epitaxy on InP substrates. We observe a robust zero-bias conductance peak quantised near 2e²/h persisting over magnetic field ranges of 0.05–0.41 T and surviving thermal cycling to 4 K, consistent with MZM predictions. Non-local correlation measurements across opposite ends of the nanowire confirm parity-protected coherence over 0.8 μs, an order of magnitude improvement over previous reports. Analysis of 22 devices establishes the role of growth temperature and Al shell thickness in optimising topological phase diagram visibility.',
      keywords: 'Majorana fermions, topological superconductor, nanowires, quantum computing, condensed matter physics, tunnelling spectroscopy',
      doi: '10.55001/gij.v5.05.004',
      page_start: 81,
      page_end: 106,
      submission_date: new Date('2025-03-20'),
      acceptance_date: new Date('2025-05-12'),
      author_ids: [19, 32, 3],
      corresponding: 0,
    },
    {
      issue_idx: 9,
      title: 'Valley Polarisation and Interlayer Excitons in MoS₂/WSe₂ van der Waals Heterostructures for Valleytronic Devices',
      abstract:
        'Valleytronics exploits the degenerate band extrema (valleys) in two-dimensional hexagonal lattices as an additional degree of freedom for information encoding. This paper reports optical and electrical characterisation of MoS₂/WSe₂ type-II van der Waals heterostructures fabricated by deterministic dry-transfer under ultra-high-vacuum conditions, eliminating interlayer contamination. Circularly polarised photoluminescence at 10 K reveals interlayer exciton valley polarisation of 78% ± 4%, compared to <30% in literature air-assembled devices. Gate-tunable valley Hall voltage measurements at room temperature demonstrate valley-polarised current densities of 0.12 μA μm⁻¹, the highest reported at non-cryogenic temperatures. Theoretical modelling combining first-principles DFT and Boltzmann transport quantitatively reproduces the gate-dependent valley relaxation times, providing design rules for room-temperature valleytronic transistors.',
      keywords: 'valleytronics, MoS2, WSe2, van der Waals heterostructure, 2D materials, interlayer exciton',
      doi: '10.55001/gij.v5.05.005',
      page_start: 107,
      page_end: 130,
      submission_date: new Date('2025-04-01'),
      acceptance_date: new Date('2025-05-20'),
      author_ids: [10, 21, 31],
      corresponding: 0,
    },

    // ── Vol 5, Issue 6: Energy Systems and Sustainable Innovation ──
    {
      issue_idx: 10,
      title: 'High-Temperature Solid Oxide Electrolysis for Green Hydrogen: Stack Performance, Degradation Mechanisms, and Scale-Up',
      abstract:
        'Solid oxide electrolysis cells (SOECs) operating above 700°C offer thermodynamic advantages over proton-exchange membrane electrolysers by exploiting thermal co-inputs, potentially reducing electricity consumption by 25–35%. This paper characterises a 25-kW SOEC stack manufactured from Ni-YSZ/8YSZ/LSCF cell assemblies and operated under steam-rich (80 vol%) conditions over 8,760 hours (one year). Beginning-of-life efficiency was 81.3% (LHV basis) at 0.9 A cm⁻², degrading to 76.1% at end of test — a rate of 0.6% per 1,000 h, meeting the EU Green Hydrogen Alliance target. Post-mortem analysis by SEM-EDX and Raman spectroscopy attributes 60% of the degradation to Ni coarsening at the fuel electrode and 28% to Sr diffusion in the air-electrode interface. Scale-up modelling for a 1 MW system project levelised hydrogen cost of $2.80 kg⁻¹ with 70% capacity factor renewable electricity, competitive with steam methane reforming with CCS.',
      keywords: 'solid oxide electrolysis, green hydrogen, water splitting, SOEC, degradation, electrochemistry',
      doi: '10.55001/gij.v5.06.001',
      page_start: 1,
      page_end: 28,
      submission_date: new Date('2025-03-12'),
      acceptance_date: new Date('2025-05-22'),
      author_ids: [7, 22, 29],
      corresponding: 0,
    },
    {
      issue_idx: 10,
      title: 'Grid-Scale Energy Storage: Techno-Economic Comparison of Vanadium Flow, Iron-Air, and Lithium-Iron-Phosphate Batteries',
      abstract:
        'The rapid deployment of variable renewable energy necessitates long-duration grid storage technologies capable of economically storing 8–100 hours of energy. This study provides a rigorous techno-economic comparison of three candidate grid-scale storage technologies — vanadium redox flow batteries (VRFB), iron-air batteries (IAB), and lithium iron phosphate systems (LFP) — across four representative grid archetypes: island microgrids, industrial parks, distribution substations, and bulk transmission storage. Using a time-series dispatch model calibrated on 2024 wholesale electricity market data from California, Germany, South Australia, and India, we determine levelised cost of storage (LCOS) and capacity value premium for each technology-application pair. VRFB achieves the lowest LCOS for long-duration (≥ 12 h) island microgrid applications at $0.18 kWh⁻¹ cycle⁻¹; LFP retains advantage for sub-6-hour applications. IAB shows strong economic potential but requires further cycle-life improvements to reach cost parity by 2030.',
      keywords: 'energy storage, grid storage, flow battery, lithium-ion, techno-economic analysis, renewable energy integration',
      doi: '10.55001/gij.v5.06.002',
      page_start: 29,
      page_end: 54,
      submission_date: new Date('2025-03-25'),
      acceptance_date: new Date('2025-05-30'),
      author_ids: [17, 26, 37],
      corresponding: 1,
    },
    {
      issue_idx: 10,
      title: 'Offshore Wind Farm Layout Optimisation with Dynamic Wake Modelling Using Multi-Objective Evolutionary Algorithms',
      abstract:
        'Wind turbine wakes reduce downwind turbine power output by 10–40% in large offshore arrays, making layout optimisation critical for maximising annual energy yield. This paper introduces DynaWake-OPT, a layout optimisation framework coupling a dynamic wake model (FLORIS-FAST) with a non-dominated sorting genetic algorithm III (NSGA-III) to Pareto-optimise three competing objectives: annual energy production, installation cost, and cable length. Applied to a 500 MW reference wind farm in the North Sea under 30 years of ERA5 reanalysis wind data, DynaWake-OPT increases AEP by 7.4% compared to grid layouts and 3.1% compared to conventional wake-free optimisation, while reducing total cable cost by €12.4 million. Wind direction variability and turbulence intensity are incorporated as probabilistic constraints. Results are validated against two operational DONG Energy farms using 5-year SCADA datasets with mean absolute AEP error below 2.1%.',
      keywords: 'offshore wind, wake effect, layout optimisation, genetic algorithm, FLORIS, renewable energy',
      doi: '10.55001/gij.v5.06.003',
      page_start: 55,
      page_end: 78,
      submission_date: new Date('2025-04-05'),
      acceptance_date: new Date('2025-06-02'),
      author_ids: [5, 33, 20],
      corresponding: 0,
    },
    {
      issue_idx: 10,
      title: 'Agrivoltaics: Simultaneous Solar Energy Generation and Crop Production — Field Performance Across Five Climate Zones',
      abstract:
        'Agrivoltaic systems — which co-locate photovoltaic panels above agricultural land — have potential to double the energy and food value of a given land area while reducing water consumption through microclimate modification. This paper reports results from a coordinated multi-site agrivoltaic trial across five climate zones: semi-arid Mediterranean, humid temperate, tropical monsoon, continental steppe, and cold highland, each covering 2–4 ha demonstration plots over two full cropping cycles. Panel height (2.5 m vs. 1.5 m), bifaciality, and crop selection are evaluated in a factorial design. Solar energy yield per land area averages across sites is 94% of conventional ground-mounted systems, while crop yield is maintained at 78–102% of open-field controls depending on crop shade tolerance. Maize and soybean show no significant yield reduction under 2.5 m arrays; leafy vegetables benefit from partial shading in hot climates. Total land-use efficiency (LUE) exceeds 160% in all sites, validating agrivoltaics as a synergistic dual land-use strategy.',
      keywords: 'agrivoltaics, solar energy, food security, land-use efficiency, photovoltaic, sustainable agriculture',
      doi: '10.55001/gij.v5.06.004',
      page_start: 79,
      page_end: 102,
      submission_date: new Date('2025-04-18'),
      acceptance_date: new Date('2025-06-10'),
      author_ids: [15, 34, 24],
      corresponding: 0,
    },
    {
      issue_idx: 10,
      title: 'Compact Fusion Reactor Economics: Technology Readiness, Investment Landscape, and 2050 Commercial Roadmap',
      abstract:
        'Private investment in nuclear fusion reached a cumulative $6.2 billion by 2024, distributed across more than 40 commercial ventures pursuing magnetic confinement, inertial fusion, and hybrid approaches. This paper synthesises engineering, financial, and regulatory dimensions of the commercial fusion pathway, drawing on technology readiness level assessments of 12 leading ventures, analysis of 86 investment rounds, and stakeholder interviews with 34 experts. Levelised-cost-of-electricity (LCOE) modelling under optimistic, central, and pessimistic scenarios — incorporating first-of-a-kind cost premiums, capacity factors, and plant lifetimes — yields a central estimate of $0.09–0.14 kWh⁻¹ for nth-of-a-kind fusion plants operating by 2050. The critical path bottleneck is identified as tritium breeding blanket development and materials qualification under 14 MeV neutron irradiation. Regulatory pathways in the United States, United Kingdom, and European Union are compared, identifying early design certification models as essential accelerators for commercial timelines.',
      keywords: 'nuclear fusion, LCOE, commercial fusion, energy economics, tokamak, technology roadmap',
      doi: '10.55001/gij.v5.06.005',
      page_start: 103,
      page_end: 128,
      submission_date: new Date('2025-04-30'),
      acceptance_date: new Date('2025-06-18'),
      author_ids: [9, 27, 16],
      corresponding: 1,
    },

    // ── Vol 5, Issue 7: Robotics, Automation, and Autonomous Systems ──
    {
      issue_idx: 11,
      title: 'Heterogeneous Swarm Robotics for Urban Search and Rescue: Coordination Algorithms and Large-Scale Field Experiments',
      abstract:
        'Coordinating heterogeneous robot swarms comprising aerial scouts, ground search units, and communication relay nodes in dynamic post-disaster environments is a fundamental open problem in autonomous systems. This paper presents SwarmRescue, a hierarchical coordination architecture that combines decentralised auction-based task allocation with stigmergy-inspired pheromone gradient navigation for indoor-outdoor hybrid environments. Experiments across three physical test environments — a partially collapsed reinforced-concrete structure, an urban rubble field, and a multi-storey building — involve swarms of 8–48 robots of four distinct morphologies. Survivor detection rate reaches 92.3% within 30 minutes for stationary victims and 81.5% for ambulatory casualties, versus 67% and 54%, respectively, for human-guided teleoperation teams. Communication resilience under 40% node failure is maintained by adaptive topology reconfiguration with median overhead of 9.4% bandwidth. SAR coordinators in post-trial evaluation rated SwarmRescue explanations as "sufficient for operational trust" in 88% of scenarios.',
      keywords: 'swarm robotics, search and rescue, multi-robot coordination, autonomous systems, UAV, task allocation',
      doi: '10.55001/gij.v5.07.001',
      page_start: 1,
      page_end: 28,
      submission_date: new Date('2025-04-08'),
      acceptance_date: new Date('2025-06-20'),
      author_ids: [0, 21, 36],
      corresponding: 0,
    },
    {
      issue_idx: 11,
      title: 'Biomimetic Soft Robots Inspired by Cephalopod Locomotion: Compliant Manipulation in Unstructured Environments',
      abstract:
        'Rigid robotic manipulators struggle in the unstructured, contact-rich environments encountered in disaster response, minimally invasive surgery, and deep-sea exploration. Cephalopod arms — capable of forming infinite-degree-of-freedom compliant structures using muscular hydrostats — offer a compelling biological blueprint. This paper presents OctoBot-III, a soft robotic arm fabricated from silicone-embedded shape-memory alloy (SMA) fibre networks with antagonistic control equivalent to longitudinal and transverse musculature. Eight arms of 380 mm length each exert tip forces up to 4.2 N and achieve end-effector positioning accuracy of ±2.1 mm in free space, controlled by a model predictive controller using Cosserat rod dynamics. Grasping trials on 200 irregular objects spanning a Reynolds similarity range demonstrate 94.5% grasp success with unmodelled objects, with simultaneous obstacle avoidance during retrieval. OctoBot-III dextrous manipulation is demonstrated in underwater manipulation at 200 m simulated pressure.',
      keywords: 'soft robotics, biomimetic, cephalopod, compliant manipulation, shape memory alloy, underwater robotics',
      doi: '10.55001/gij.v5.07.002',
      page_start: 29,
      page_end: 54,
      submission_date: new Date('2025-04-22'),
      acceptance_date: new Date('2025-06-28'),
      author_ids: [11, 38, 6],
      corresponding: 1,
    },
    {
      issue_idx: 11,
      title: 'Trust Calibration in Human-Robot Teaming: Real-Time Transparency Mechanisms for Industrial Collaborative Assembly',
      abstract:
        'Miscalibrated trust — either over-trust or under-trust in robotic partners — significantly reduces efficiency and safety in shared-workspace human-robot collaboration. This paper introduces TrustSync, a real-time trust calibration framework that estimates human operator trust level using physiological signals (galvanic skin response, heart rate variability) and dwell-time gaze patterns, then adapts robot communication modality and explanation verbosity accordingly. A human factors experiment involving 180 participants on a simulated engine-assembly line demonstrates that TrustSync yields 22.4% higher task throughput, 38% fewer operator interventions, and a 0.61-point improvement (on a 7-point Likert scale) in subjectively perceived robot reliability compared to static verbal-feedback-only baselines. Safety incident rate fell from 3.1 to 0.8 per 100 assembly cycles. Longitudinal trust drift is successfully compensated over a 60-minute session by proactive uncertainty disclosures triggered by the framework.',
      keywords: 'human-robot collaboration, trust calibration, physiological sensing, explainable AI, industrial robotics, transparency',
      doi: '10.55001/gij.v5.07.003',
      page_start: 55,
      page_end: 78,
      submission_date: new Date('2025-05-06'),
      acceptance_date: new Date('2025-07-04'),
      author_ids: [14, 39, 18],
      corresponding: 0,
    },
    {
      issue_idx: 11,
      title: 'LiDAR-Inertial SLAM for Underground Mine Inspection: Design, Validation, and 14-Day Autonomous Deployment',
      abstract:
        'Underground mine inspection poses extreme challenges for autonomous navigation: GPS denial, dynamic dust-laden atmospheres, narrow irregular passages, lack of prior maps, and featureless surfaces that defeat standard visual SLAM. This paper presents MineNav, a tightly coupled LiDAR-inertial simultaneous localisation and mapping system built on a modified Legged robot platform (ANYmal-C), adapted with anti-static coatings, intrinsically safe electronics certification, and a long-endurance battery pack. The SLAM back-end employs factor graph optimisation using GTSAM with a novel reflectivity-weighted point-cloud registration factor that improves drift correction in low-texture rock tunnels. Validated across 6.8 km of mapped passageways in an active Chilean copper mine over 14 days of autonomous deployment, MineNav achieves 3D positioning RMSE of 8.4 cm, loop-closure detection rate of 97.2%, and completes full-tunnel inspection surveys 4.7× faster than human rope-access teams with zero safety incidents.',
      keywords: 'SLAM, LiDAR, underground mine, autonomous inspection, robotics, legged robot',
      doi: '10.55001/gij.v5.07.004',
      page_start: 79,
      page_end: 104,
      submission_date: new Date('2025-05-20'),
      acceptance_date: new Date('2025-07-12'),
      author_ids: [12, 32, 1],
      corresponding: 0,
    },
    {
      issue_idx: 11,
      title: 'Long-Range Autonomous Underwater Gliders for Deep-Ocean Data Collection: Energy Harvesting and Communication Architecture',
      abstract:
        'Oceanographic understanding of mesoscale dynamics, carbon flux, and deep-water circulation is limited by the high cost and sparse coverage of conventional ship-based sampling. This paper presents DeepGlide-X, a long-endurance autonomous underwater glider equipped with thermoelectric energy harvesting modules exploiting the 10–15°C thermal gradient at the thermocline, extending operational range by 34% to 12,000 km per deployment. Low-power acoustic Doppler current profilers, dissolved oxygen optodes, and miniaturised CTD sensors are integrated enabling full-depth profiling to 1,500 m. A novel acoustic relay-to-satellite communication protocol achieves near-real-time data delivery at 96% packet receipt with 8-hour latency. Field deployments in the Southern Ocean (3 gliders, 180 days) collected 22,400 depth profiles, 40× more than concurrent ship surveys in the same region. Machine-learning current-adaptive routing reduced total mission energy consumption by 18% against static programmatic flight paths.',
      keywords: 'autonomous underwater vehicle, ocean glider, thermoelectric harvesting, oceanography, deep-sea, acoustic communication',
      doi: '10.55001/gij.v5.07.005',
      page_start: 105,
      page_end: 130,
      submission_date: new Date('2025-06-02'),
      acceptance_date: new Date('2025-07-20'),
      author_ids: [19, 25, 35],
      corresponding: 0,
    },

    // ── Vol 5, Issue 8: Cybersecurity, Privacy, and Network Systems ──
    {
      issue_idx: 12,
      title: 'CRYSTALS-Kyber and CRYSTALS-Dilithium on ARM Cortex-M4: Side-Channel Resistance, Performance, and Memory Footprint',
      abstract:
        'The NIST Post-Quantum Cryptography standardisation process has selected CRYSTALS-Kyber for key encapsulation and CRYSTALS-Dilithium for digital signatures, making their embedded implementation critical for billions of IoT and industrial control devices. This paper presents fully optimised implementations of both algorithms on the ARM Cortex-M4 processor targeting the STM32F407 development board, incorporating assembly-level number-theoretic transform (NTT) optimisation, lazy reduction, and cache-timing side-channel countermeasures based on constant-time barrel shuffling. Kyber-768 key generation executes in 167 k cycles (vs. 612 k for the reference implementation), encapsulation in 208 k cycles, and decapsulation in 220 k cycles. A thorough leakage assessment using TVLA across 100,000 power traces confirms no first- or second-order leakage with p-values > 0.05. Stack memory usage is held below 6 KB, demonstrating viability on deeply embedded targets with 8 KB RAM.',
      keywords: 'post-quantum cryptography, CRYSTALS-Kyber, CRYSTALS-Dilithium, ARM Cortex-M4, side-channel attack, embedded systems',
      doi: '10.55001/gij.v5.08.001',
      page_start: 1,
      page_end: 26,
      submission_date: new Date('2025-05-05'),
      acceptance_date: new Date('2025-07-15'),
      author_ids: [3, 22, 30],
      corresponding: 0,
    },
    {
      issue_idx: 12,
      title: 'Adversarial Robustness of Graph Neural Networks for Network Intrusion Detection Against Evasion and Poisoning Attacks',
      abstract:
        'Graph neural network (GNN) intrusion detection systems (IDS) model network traffic as dynamic graphs, capturing structural and temporal patterns that evade signature-based and statistical detectors. However, adversarial attackers can potentially manipulate graph topology to evade detection. This paper provides the first systematic evaluation of five GNN-IDS architectures (GCN, GAT, GraphSAGE, TGAT, and TGN) under six white-box and black-box adversarial attack strategies, including node feature perturbation, edge injection, and training-time data poisoning. Evaluated on the CICIDS-2018, UNSW-NB15, and a novel realistic enterprise traffic capture dataset, undefended GNN-IDS detection rates fall from 97.3% to 41.8% under optimal white-box edge-injection attacks. We introduce GraphDefend, combining adversarial training, spectral graph regularisation, and ensemble voting, which restores detection rates to 91.6% under the same attacks with only 2.4% benign traffic false-positive increase. Transferability of attacks across GNN architectures is shown to be limited, motivating ensemble deployment.',
      keywords: 'graph neural networks, intrusion detection, adversarial machine learning, network security, evasion attacks, robustness',
      doi: '10.55001/gij.v5.08.002',
      page_start: 27,
      page_end: 52,
      submission_date: new Date('2025-05-18'),
      acceptance_date: new Date('2025-07-24'),
      author_ids: [13, 20, 28],
      corresponding: 1,
    },
    {
      issue_idx: 12,
      title: 'Zero-Trust Architecture in Healthcare Organisations: Deployment Case Studies and Operational Lessons from Five Hospital Networks',
      abstract:
        'Ransomware attacks on healthcare organisations have escalated dramatically, with 389 publicly disclosed incidents in 2024 alone disrupting patient care and exposing sensitive records. Zero-trust architecture (ZTA), which enforces continuous verification of all identities and devices regardless of network origin, is increasingly mandated by regulators but remains complex to deploy in legacy-heavy clinical environments. This paper presents in-depth case studies of ZTA deployments across five hospital networks in the United States, Germany, and Australia, spanning 18–36 months of implementation. We document technical architectures, migration challenges, performance impacts on clinical workflows, and measured security outcomes. Post-ZTA deployments reduced lateral movement incidents by 94%, mean time to detect breaches from 214 to 31 days, and eliminated 100% of successful VPN-exploiting ransomware attacks that were feasible in the pre-ZTA environment. A repeatable implementation framework, maturity model, and staff training curriculum derived from cross-site lessons are provided.',
      keywords: 'zero-trust architecture, healthcare cybersecurity, ransomware, network security, clinical IT, identity verification',
      doi: '10.55001/gij.v5.08.003',
      page_start: 53,
      page_end: 76,
      submission_date: new Date('2025-06-01'),
      acceptance_date: new Date('2025-07-30'),
      author_ids: [18, 31, 7],
      corresponding: 0,
    },
    {
      issue_idx: 12,
      title: 'Multi-Modal Deepfake Detection Using Temporal Inconsistency Analysis Across Synchronised Audio-Visual Streams',
      abstract:
        'AI-generated deepfake videos now achieve near-indistinguishable visual realism, creating risks for misinformation, identity fraud, and evidence tampering. Existing detectors that rely on visual artefacts alone are increasingly defeated by state-of-the-art synthesis models. This paper introduces AV-Forge, a multi-modal deepfake detector that exploits computational constraints of current deepfake pipelines: audio-visual synchronisation lags of 3–15 ms, lip-phoneme boundary timing inconsistencies, and micro-expression absence during synthesised emotional speech. AV-Forge applies cross-modal attention to fused spectrotemporal audio features and dense optical flow representations, trained on a novel 480,000-clip dataset spanning 14 deepfake generation methods. Detection accuracy on unseen generation architectures reaches 96.7% AUC with 3.2% false positive rate on genuine video content. Robustness to video compression (H.264/H.265 at CRF 28–40) and re-encoding is demonstrated, which most existing detectors fail to handle.',
      keywords: 'deepfake detection, audio-visual, multi-modal fusion, synthetic media, forensics, misinformation',
      doi: '10.55001/gij.v5.08.004',
      page_start: 77,
      page_end: 100,
      submission_date: new Date('2025-06-14'),
      acceptance_date: new Date('2025-08-05'),
      author_ids: [0, 39, 23],
      corresponding: 0,
    },
    {
      issue_idx: 12,
      title: 'Firmware Vulnerability Discovery in Consumer IoT via Binary Analysis and Automated Exploit Generation',
      abstract:
        'Consumer IoT devices — smart speakers, home routers, security cameras, and thermostats — frequently ship with unpatched firmware vulnerabilities that persist for years after disclosure due to absent or infrequent update mechanisms. This paper introduces FirmHunter, an automated static-dynamic binary analysis pipeline for discovering memory-safety and logic vulnerabilities in ARM and MIPS embedded firmware without source code. FirmHunter combines symbolic execution with a domain-specific firmware emulation layer (QEMU extensions for common peripheral models) and a vulnerability-pattern neural classifier trained on 22,000 known CVE code fragments. Applied to 2,860 firmware images from 18 manufacturers collected in 2024, FirmHunter identified 347 previously unreported vulnerabilities, of which independent verification confirmed 228 as exploitable. Median time from acquisition to proof-of-concept exploit is 4.2 hours on a 16-core server. Coordinated disclosure resulted in 141 CVE assignments and firmware patches from 11 of 18 vendors.',
      keywords: 'firmware security, IoT security, binary analysis, symbolic execution, vulnerability discovery, embedded systems',
      doi: '10.55001/gij.v5.08.005',
      page_start: 101,
      page_end: 126,
      submission_date: new Date('2025-06-26'),
      acceptance_date: new Date('2025-08-12'),
      author_ids: [10, 37, 34],
      corresponding: 1,
    },

    // ── Vol 5, Issue 9: Computational Biology and Bioinformatics ──
    {
      issue_idx: 13,
      title: 'AlphaFold-Multimer for Protein Complex Structure Prediction: Benchmarking Against Cryo-EM and X-Ray Crystallography',
      abstract:
        'AlphaFold-Multimer extended AlphaFold2 to multi-chain complex prediction, but systematic evaluation against experimentally resolved complex structures has so far been limited in scope and methodology. This paper benchmarks AlphaFold-Multimer v2.3 against a curated test set of 1,840 protein hetero- and homo-complexes deposited in the PDB between 2023 and 2025 — explicitly excluded from AlphaFold training — spanning binary dimers through octameric assemblies. Interface DockQ scores averaged 0.68 for homo-dimers and 0.54 for hetero-tetramers, with 71% of predictions within 2 Å RMSD of experimental structure for complexes below 400 residues. Performance degrades substantially for intrinsically disordered interface regions (DockQ 0.29) and complexes requiring large conformational rearrangement upon binding. We identify MSA depth and evolutionary coupling signal as the primary predictors of model quality and provide correction factors for confidence score calibration that improve positive predictive value for drug-target interface models by 14%.',
      keywords: 'AlphaFold, protein complex, structure prediction, cryo-EM, bioinformatics, computational biology',
      doi: '10.55001/gij.v5.09.001',
      page_start: 1,
      page_end: 28,
      submission_date: new Date('2025-06-10'),
      acceptance_date: new Date('2025-08-18'),
      author_ids: [1, 29, 38],
      corresponding: 0,
    },
    {
      issue_idx: 13,
      title: 'Spatial Transcriptomics Reveals Tumour Microenvironment Architecture in Pancreatic Ductal Adenocarcinoma',
      abstract:
        'Pancreatic ductal adenocarcinoma (PDAC) is characterised by a highly immunosuppressive tumour microenvironment (TME) that contributes to poor immunotherapy response, yet the spatial organisation of cellular interactions within the TME is incompletely understood. This study applies 10x Visium and MERFISH spatial transcriptomics to 48 PDAC tissue sections from 32 patients with matched clinical outcomes, generating spatially resolved expression profiles for > 15,000 genes across 1.8 million spots. Unsupervised spatial domain detection identifies five recurrent TME archetypes distinguished by stromal density, macrophage polarisation state, and CD8⁺ T-cell infiltration patterns. Archetype 2, characterised by CAF-T-cell exclusion tracks and M2 macrophage enrichment, correlates with significantly inferior overall survival (HR 2.41, p = 0.003). Cell-cell communication analysis reveals novel SPP1-CD44 and TIGIT-PVR paracrine signalling axes as potential immunotherapy targets not identified by bulk transcriptomics.',
      keywords: 'spatial transcriptomics, pancreatic cancer, tumour microenvironment, MERFISH, immunotherapy, single-cell',
      doi: '10.55001/gij.v5.09.002',
      page_start: 29,
      page_end: 56,
      submission_date: new Date('2025-06-24'),
      acceptance_date: new Date('2025-08-28'),
      author_ids: [2, 33, 24],
      corresponding: 1,
    },
    {
      issue_idx: 13,
      title: 'Genome-Wide DNA Methylation Landscape Changes Under Prolonged Heat Stress in Arabidopsis thaliana',
      abstract:
        'Plants use epigenetic mechanisms, including DNA methylation, to modulate gene expression in response to environmental stress, yet the heritability and functional significance of heat-induced methylome changes remain poorly characterised. This study performs whole-genome bisulphite sequencing (WGBS) at 30× coverage on Arabidopsis thaliana ecotypes Col-0 and Cvi-0 exposed to a realistic heat stress regime (38°C for 10 days) and their recovery-phase and F1 progeny. Heat stress induces widespread hypomethylation (CHH context predominantly, 14,836 differentially methylated regions) at transposable element-flanking sequences and promoters of stress-responsive genes, with 38% of changes persisting into the F1 generation. RNA-seq confirms activation of 242 transposable element families previously silenced by CG methylation. Integrating ATAC-seq chromatin accessibility data with methylation dynamics reveals that hypomethylation at specific loci anticipates transcriptional memory of heat stress priming, providing a candidate epigenetic regulatory mechanism for transgenerational thermotolerance.',
      keywords: 'DNA methylation, heat stress, Arabidopsis, epigenetics, transgenerational, chromatin',
      doi: '10.55001/gij.v5.09.003',
      page_start: 57,
      page_end: 80,
      submission_date: new Date('2025-07-08'),
      acceptance_date: new Date('2025-09-02'),
      author_ids: [19, 26, 15],
      corresponding: 0,
    },
    {
      issue_idx: 13,
      title: 'Comparative Pan-Genome Analysis of 1,000 Klebsiella pneumoniae Clinical Isolates: Resistome, Virulome, and Phylogenomics',
      abstract:
        'Klebsiella pneumoniae is a major cause of healthcare-associated infections with alarmingly high rates of carbapenem and colistin co-resistance. This study constructs the largest curated K. pneumoniae pan-genome to date from 1,000 whole-genome sequences of clinical isolates collected from 22 hospitals across 11 countries between 2018 and 2024. Open pan-genome analysis identifies a core genome of 5,124 genes and an accessory genome of 41,208 genes. Resistome analysis reveals that 34.7% of isolates carry carbapenemase genes (KPC-2/KPC-3, NDM-1, OXA-48), with significant geographic clustering. Virulome characterisation identifies hypervirulent pLVPK-type plasmids in 18.2% of clinical isolates, increasingly co-occurring with carbapenem resistance plasmids — a convergence that portends untreatable infection. Phylogenomic analysis delineates eight major K. pneumoniae clonal lineages, with ST258 and ST147 accounting for 49% of carbapenem-resistant isolates globally.',
      keywords: 'pan-genome, Klebsiella pneumoniae, antibiotic resistance, carbapenem, phylogenomics, hospital-acquired infection',
      doi: '10.55001/gij.v5.09.004',
      page_start: 81,
      page_end: 106,
      submission_date: new Date('2025-07-22'),
      acceptance_date: new Date('2025-09-10'),
      author_ids: [4, 21, 36],
      corresponding: 0,
    },
    {
      issue_idx: 13,
      title: 'Circulating Microbial Cell-Free DNA as a Non-Invasive Liquid Biopsy Biomarker for Early Colorectal Cancer Detection',
      abstract:
        'Colorectal cancer (CRC) has high survival rates when detected at Stage I/II, yet colonoscopy-based screening remains costly and invasive, limiting compliance. Circulating cell-free DNA (cfDNA) derived from tumour-associated microbiome dysbiosis has recently emerged as a candidate liquid biopsy analyte. This study profils plasma microbial cfDNA using metagenomic sequencing in 1,240 participants comprising Stage I–IV CRC cases, colorectal adenoma patients, and healthy colonoscopy-confirmed controls from three clinical centres. Using a 28-species sparse classifier trained on 60% of the cohort, we achieve AUROC 0.914 (95% CI 0.886–0.942) for early-stage (I/II) CRC vs. healthy controls, with sensitivity 83.6% at 90% specificity. A combined microbial cfDNA + methylated SEPTIN9 panel raises AUROC to 0.938. Analysis of serial samples from adenoma patients suggests detectability up to 36 months before clinical diagnosis in 31% of advanced adenomas, positioning microbial cfDNA as a promising addition to multi-analyte CRC screening panels.',
      keywords: 'liquid biopsy, cell-free DNA, colorectal cancer, microbiome, early detection, metagenomics',
      doi: '10.55001/gij.v5.09.005',
      page_start: 107,
      page_end: 130,
      submission_date: new Date('2025-08-05'),
      acceptance_date: new Date('2025-09-18'),
      author_ids: [11, 35, 28],
      corresponding: 0,
    },

    // ── Vol 5, Issue 10: Economics, Finance, and Data Analytics ──
    {
      issue_idx: 14,
      title: 'Retail Central Bank Digital Currencies and Financial Inclusion: Evidence from Pilot Programmes in 12 Countries',
      abstract:
        'Retail central bank digital currencies (CBDCs) are being piloted with the explicit goal of expanding financial services access to the unbanked and underbanked population, yet rigorous evaluation of pilot outcomes remains scarce. This paper analyses deidentified transaction-level and survey data from 12 live CBDC retail pilot programmes — spanning the Caribbean, sub-Saharan Africa, South-East Asia, and West Africa — covering a combined 4.2 million wallet holders between 2020 and 2024. Difference-in-differences estimation using comparable excluded populations finds that CBDC adoption increases formal savings rates by 11.4 percentage points (pp), formal payments volume by 28.7 pp, and credit bureau enrolment by 9.1 pp among previously unbanked adults. Gender gaps in adoption are significant: without active outreach, female adoption lags male by 18 pp. Design features including offline functionality, agent banking integration, and mobile money interoperability are the strongest predictors of inclusion outcomes in low-connectivity environments.',
      keywords: 'CBDC, central bank digital currency, financial inclusion, digital payments, unbanked, monetary policy',
      doi: '10.55001/gij.v5.10.001',
      page_start: 1,
      page_end: 28,
      submission_date: new Date('2025-07-05'),
      acceptance_date: new Date('2025-09-15'),
      author_ids: [9, 27, 37],
      corresponding: 0,
    },
    {
      issue_idx: 14,
      title: 'Global Supply Chain Reconfiguration Post-COVID-19: Reshoring, Near-Shoring, and Friend-Shoring Strategies',
      abstract:
        'The COVID-19 pandemic and ensuing geopolitical shocks exposed deep structural vulnerabilities in globally integrated supply chains, prompting extensive corporate and policy discourse on reshoring and diversification. This paper provides the most comprehensive empirical analysis to date of post-2020 supply chain reconfiguration, drawing on firm-level data from 38,000 multinational enterprises in 47 countries spanning manufacturing, electronics, pharmaceuticals, and food industries. Using difference-in-differences and synthetic control methods, we assess the magnitude, sectoral distribution, and economic consequences of announced reshoring, near-shoring, and friend-shoring initiatives between 2020 and 2024. Only 14% of announced reshoring projects resulted in completed production facility relocation; near-shoring to proximate countries with lower labour costs accounted for 52% of actual supply chain changes. Reshored production carries a cost premium of 18–41%, partially offset by inventory reduction and lead-time improvements. Winner and loser countries in the friend-shoring transition are identified using bilateral trade flow analysis.',
      keywords: 'supply chain, reshoring, nearshoring, globalisation, trade policy, COVID-19',
      doi: '10.55001/gij.v5.10.002',
      page_start: 29,
      page_end: 54,
      submission_date: new Date('2025-07-18'),
      acceptance_date: new Date('2025-09-25'),
      author_ids: [7, 20, 31],
      corresponding: 1,
    },
    {
      issue_idx: 14,
      title: 'Nowcasting GDP Growth Using High-Frequency Alternative Data: A Machine Learning Framework with Real-Time Validation',
      abstract:
        'Official GDP estimates are released with 30–90-day lags, creating demand for real-time economic nowcasting. Although satellite, financial transaction, and web-search data have been individually explored, a systematic framework integrating diverse high-frequency alternative data sources through machine learning has not been established. This paper introduces NowcasML, a nowcasting framework that ingests 47 alternative data series — including night-light satellite imagery, credit card spending by sector, job posting volumes, electricity consumption, and shipping container throughput — for 35 economies, and compares gradient boosting, LSTM, and transformer-based models against benchmark models. Out-of-sample RMSE for current-quarter GDP growth is 0.31 pp (log-scale) for the best-performing ensemble, 42% lower than benchmark AR models and 28% lower than existing official nowcast systems. The framework processes new data within 6 hours of release, enabling genuinely timely estimates during high-volatility periods such as the 2025 global tariff shock.',
      keywords: 'GDP nowcasting, alternative data, machine learning, economic forecasting, real-time econometrics, satellite data',
      doi: '10.55001/gij.v5.10.003',
      page_start: 55,
      page_end: 78,
      submission_date: new Date('2025-08-01'),
      acceptance_date: new Date('2025-10-02'),
      author_ids: [14, 23, 13],
      corresponding: 0,
    },
    {
      issue_idx: 14,
      title: 'Top Income Inequality and Innovation: Panel Evidence from Patent Data Across 40 OECD and Emerging Economies',
      abstract:
        'The relationship between income inequality and innovation is theoretically ambiguous: concentrated wealth may finance risky R&D, but inequality may also suppress human capital accumulation that sustains broad-based inventive activity. This paper exploits variation in top-income shares from the World Inequality Database, linked to inventor-level patent data from the PATSTAT Global database, to identify the causal effect of inequality on innovation quantity and quality for 40 economies over the period 1970–2023. Instrumental variables estimation using inheritance taxation reforms as exogenous shifters of inequality reveals a significant inverse U-shaped relationship: moderate inequality (Gini 28–35) is associated with 7.4% higher aggregate patent productivity compared to the most egalitarian societies, while high inequality (Gini > 45) is associated with 12.8% lower innovation quality as measured by forward citations. Inventor diversity — particularly the share of female and first-generation-immigrant inventors — partially mediates these effects, highlighting the importance of meritocratic knowledge-worker access.',
      keywords: 'income inequality, innovation, patents, top incomes, R&D, economic growth',
      doi: '10.55001/gij.v5.10.004',
      page_start: 79,
      page_end: 102,
      submission_date: new Date('2025-08-15'),
      acceptance_date: new Date('2025-10-10'),
      author_ids: [18, 32, 8],
      corresponding: 0,
    },
    {
      issue_idx: 14,
      title: 'ESG Portfolio Performance During the 2022–2024 Energy and Rate Shock: Factor Attribution and Downside Risk Analysis',
      abstract:
        'The triple shocks of the 2022 energy crisis, rapid interest rate normalisation, and increased geopolitical risk provided the first major stress test of ESG-tilted investment portfolios since the strategy\'s mainstream adoption. This paper analyses monthly returns of 4,200 ESG mutual funds and ETFs across 28 countries over January 2021 – December 2024, decomposing performance relative to conventional benchmarks using a six-factor Fama-French model augmented with ESG sentiment and carbon-intensity factors. ESG funds underperformed conventional benchmarks by a mean annualised 1.8 pp during Q4 2021 – Q4 2022, primarily attributable to underweighting high-carbon energy stocks that outperformed during the energy shock. During 2023–2024, ESG funds recovered to within 0.4 pp of benchmarks on a risk-adjusted basis. Conditional value-at-risk (CVaR) analysis demonstrates that ESG portfolios exhibit 11% lower tail risk than conventional counterparts over the full sample period, supporting a risk-mitigation narrative that survives short-term performance reversals.',
      keywords: 'ESG investing, portfolio performance, factor model, energy crisis, sustainable finance, downside risk',
      doi: '10.55001/gij.v5.10.005',
      page_start: 103,
      page_end: 128,
      submission_date: new Date('2025-08-28'),
      acceptance_date: new Date('2025-10-18'),
      author_ids: [17, 39, 5],
      corresponding: 1,
    },

    // ── Vol 5, Issue 11: Materials Science and Nanotechnology ──
    {
      issue_idx: 15,
      title: 'Vitrimeric Self-Healing Epoxy Nanocomposites for Aerospace Structural Repair: Mechanical Recovery and Fatigue Performance',
      abstract:
        'Aerospace composite structures are susceptible to delamination and matrix micro-cracking under cyclic loading, leading to catastrophic failure without timely repair. Vitrimers — epoxy networks cross-linked via dynamic covalent bonds — offer intrinsic self-healing capability through thermally triggered bond exchange, eliminating the need for external healing agents. This paper develops graphene nanoplatelet (GNP)-reinforced vitrimer epoxy composites with bond-exchange catalyst concentrations optimised via response surface methodology. At 0.5 wt% GNP loading and 180°C healing temperature, tensile strength recovery reaches 97.3% after a first damage cycle and 91.4% after five repeated cycles. Fatigue testing under 70% UTS load amplitude shows that healed specimens survive 1.2× more cycles than conventional repaired epoxy, attributed to residual compressive stress from healing shrinkage. A repair scenario analysis for aircraft skin panels estimates a 40% reduction in maintenance downtime and 62% decrease in repair material cost versus conventional wet-layup methods.',
      keywords: 'vitrimers, self-healing polymers, nanocomposites, graphene, aerospace, fracture mechanics',
      doi: '10.55001/gij.v5.11.001',
      page_start: 1,
      page_end: 26,
      submission_date: new Date('2025-08-08'),
      acceptance_date: new Date('2025-10-15'),
      author_ids: [6, 22, 29],
      corresponding: 0,
    },
    {
      issue_idx: 15,
      title: 'Covalent Organic Framework Interlayers for Polysulfide Shuttle Suppression in Lithium-Sulfur Batteries',
      abstract:
        'Lithium-sulfur (Li-S) batteries offer a theoretical energy density of 2,600 Wh kg⁻¹ — five times that of lithium-ion — but commercialisation is impeded by polysulfide shuttle, which causes irreversible capacity fade. This paper introduces a covalent organic framework (COF) interlayer deposited between the sulfur cathode and separator, functionalised with pyridinic nitrogen groups that chemically trap lithium polysulfide intermediates via Lewis acid-base coordination. The COF layer (thickness 8 μm, mass 0.6 mg cm⁻²) reduces polysulfide crossover by 94% as measured by UV-Vis permeation experiments. Full cells with COF-modified separators retain 81.3% capacity after 800 cycles at C/2 — compared to 52.7% for unmodified controls — and achieve initial discharge capacity of 1,348 mAh g⁻¹ at C/5. Rate capability testing demonstrates 891 mAh g⁻¹ at 2C, competitive with leading literature reports. Failure analysis by X-ray photoelectron spectroscopy and cryo-TEM confirms that COF-anchored polysulfide species are converted to Li₂S directly at the COF surface, eliminating diffusion to the Li anode.',
      keywords: 'lithium-sulfur battery, covalent organic framework, polysulfide shuttle, energy storage, cathode, electrochemistry',
      doi: '10.55001/gij.v5.11.002',
      page_start: 27,
      page_end: 52,
      submission_date: new Date('2025-08-22'),
      acceptance_date: new Date('2025-10-24'),
      author_ids: [19, 30, 3],
      corresponding: 1,
    },
    {
      issue_idx: 15,
      title: 'Multi-Walled Carbon Nanotube-Reinforced Portland Cement: Mechanical Properties, Durability, and Marine Exposure Performance',
      abstract:
        'Incorporating carbon nanotubes (CNTs) into Portland cement composites at low loadings has been shown to dramatically improve tensile and flexural strength, yet inconsistent dispersion and high cost have hindered large-scale implementation. This study evaluates multi-walled CNT (MWCNT) cement composites at 0.1–0.5 wt% loading, dispersed using a combined sonication and polycarboxylate superplasticiser protocol that achieves quantified good dispersion index > 0.85 by UV-Vis spectrophotometry. Compressive strength increased by 31%, flexural strength by 44%, and fracture toughness KIC by 38% at 0.3 wt% MWCNT — beyond which diminishing returns were observed. Specimens subjected to 36-month marine tidal zone exposure showed 61% lower chloride penetration depth than control specimens, attributed to MWCNT pore-bridging effects. Cost analysis projects that at $12 kg⁻¹ MWCNT production cost (achieved at current scale), composite cost premium is $28–44 per m³ of structural concrete — economically justified for aggressive-exposure coastal infrastructure.',
      keywords: 'carbon nanotubes, cement composites, mechanical properties, durability, marine exposure, construction materials',
      doi: '10.55001/gij.v5.11.003',
      page_start: 53,
      page_end: 76,
      submission_date: new Date('2025-09-05'),
      acceptance_date: new Date('2025-11-01'),
      author_ids: [12, 34, 25],
      corresponding: 0,
    },
    {
      issue_idx: 15,
      title: 'pH-Responsive Lipid-Polymer Hybrid Nanoparticles with Dual Drug Loading for Targeted Solid Tumour Therapy',
      abstract:
        'Solid tumours exhibit extracellular acidification (pH 6.2–6.8) and overexpress folate receptors, providing stimuli for targeted nanoparticle drug release. This paper develops folate-functionalised lipid-polymer hybrid nanoparticles (LPHNPs) encapsulating doxorubicin in pH-sensitive acetal-linked PLGA cores and curcumin in the lipid shell, enabling sequential drug release triggered by tumour microenvironment acidity. LPHNPs of 142 ± 12 nm diameter and narrow PDI (0.14) release < 12% of doxorubicin at pH 7.4 (plasma-mimicking) versus 89% at pH 5.5 (endosomal) over 48 hours. Folate receptor-mediated cellular uptake in SKOV-3 ovarian cancer cells is 4.8-fold higher than non-targeted controls. In vivo xenograft studies in athymic nude mice (n = 24) demonstrate 78% tumour growth inhibition vs. 49% for free doxorubicin at equivalent dose, with 60% reduction in cardiac toxicity biomarkers — the primary clinical dose-limitation for anthracycline therapy.',
      keywords: 'nanoparticles, drug delivery, pH-responsive, doxorubicin, cancer therapy, lipid-polymer hybrid',
      doi: '10.55001/gij.v5.11.004',
      page_start: 77,
      page_end: 100,
      submission_date: new Date('2025-09-18'),
      acceptance_date: new Date('2025-11-08'),
      author_ids: [1, 38, 24],
      corresponding: 0,
    },
    {
      issue_idx: 15,
      title: 'Room-Temperature Ferromagnetism in Cr₂Ge₂Te₆ Monolayers Grown by Molecular Beam Epitaxy: Prospects for Spintronic Devices',
      abstract:
        'Intrinsic ferromagnetism in two-dimensional van der Waals crystals was first demonstrated in Cr₂Ge₂Te₆ (CGT) in 2017, but Curie temperatures below 60 K have limited practical spintronic applications. This paper reports gate-voltage enhancement of the CGT Curie temperature to 328 K in monolayer CGT grown by molecular beam epitaxy on SrTiO₃ substrates with atomically controlled interfaces. Magneto-optical Kerr effect (MOKE) microscopy and anomalous Hall effect measurements confirm long-range ferromagnetic order with coercive field of 45 mT at 300 K. Spin-to-charge current conversion efficiency θSH = 0.38 ± 0.04 is measured by spin Hall magnetoresistance, among the highest reported for 2D magnets. First-principles calculations attribute room-temperature ferromagnetism to interface-induced eg orbital splitting that suppresses competing antiferromagnetic superexchange. These results establish gate-tunable CGT as a practical platform for spin-orbit torque devices and magnonic circuits operating at and above room temperature.',
      keywords: 'spintronics, Cr2Ge2Te6, van der Waals magnet, 2D materials, ferromagnetism, thin film',
      doi: '10.55001/gij.v5.11.005',
      page_start: 101,
      page_end: 126,
      submission_date: new Date('2025-10-02'),
      acceptance_date: new Date('2025-11-18'),
      author_ids: [10, 32, 33],
      corresponding: 0,
    },

    // ── Vol 5, Issue 12: Interdisciplinary Research and Global Challenges ──
    {
      issue_idx: 16,
      title: 'Artificial Intelligence as a Climate Modelling Tool: Neural Emulators, Statistical Downscaling, and Policy Applications',
      abstract:
        'General circulation models (GCMs) are the gold standard for climate projections but require supercomputer resources beyond the reach of most national adaptation planning agencies. This paper reviews and benchmarks AI-based climate emulators — neural network surrogates trained on GCM output to reproduce climate variable distributions at 10,000× lower computational cost — and statistical downscaling models that translate coarse GCM projections to the 1 km resolution required for local adaptation. A systematic evaluation across 12 emulator architectures on CMIP6 historical simulations identifies that graph neural networks with physics-informed constraints achieve the best temperature and precipitation reproduction (RMSE 0.28°C and 0.14 mm day⁻¹ globally). National case studies from Bangladesh, Kenya, and Peru demonstrate that AI-downscaled projections materially alter the infrastructure investment prioritisation of flood-risk adaptation plans compared to coarse-GCM-based assessments. Governance recommendations address provenance, uncertainty communication, and audit requirements for AI climate tools used in sovereign adaptation finance decisions.',
      keywords: 'AI climate modelling, neural emulators, downscaling, climate adaptation, GCM, projection',
      doi: '10.55001/gij.v5.12.001',
      page_start: 1,
      page_end: 28,
      submission_date: new Date('2025-09-08'),
      acceptance_date: new Date('2025-11-20'),
      author_ids: [0, 23, 35],
      corresponding: 0,
    },
    {
      issue_idx: 16,
      title: 'One Health Surveillance Architecture for Zoonotic Disease Early Warning: Design Principles and Global Implementation Gaps',
      abstract:
        'More than 70% of emerging infectious diseases have zoonotic origins, yet animal health, environmental, and human health surveillance systems operate largely in siloed institutional structures with minimal real-time data integration. This paper develops a comprehensive One Health Surveillance Architecture (OHSA) framework through synthesis of 285 expert interviews, analysis of 48 national pandemic preparedness plans, and evaluation of 14 prototype integrated surveillance systems deployed since 2015. Key design principles identified include interoperable minimum data sets, algorithmic anomaly detection for multi-species illness clustering, community health worker sentinel networks in high-spillover risk zones, and transparent data-sharing governance under International Health Regulations compliance. Gap analysis reveals that only 12 of 195 WHO member states have basic integrated zoonotic surveillance meeting OHSA minimum standards, with the largest gaps in Central Africa and South-East Asia — precisely the regions with highest spillover risk. Investment requirements to close global OHSA gaps are estimated at $2.4 billion annually, yielding pandemic prevention benefits of $280–640 billion per decade based on avoided event modelling.',
      keywords: 'One Health, pandemic preparedness, zoonotic disease, surveillance, emerging infectious disease, global health security',
      doi: '10.55001/gij.v5.12.002',
      page_start: 29,
      page_end: 56,
      submission_date: new Date('2025-09-22'),
      acceptance_date: new Date('2025-11-28'),
      author_ids: [4, 27, 38],
      corresponding: 1,
    },
    {
      issue_idx: 16,
      title: 'Smart City Indices and Urban Resident Well-Being: Causal Analysis of 50 Global Metropolitan Areas',
      abstract:
        'Smart city investments — encompassing sensor-based infrastructure, e-governance services, and mobility data platforms — are frequently promoted as pathways to improved resident quality of life, yet causal evidence linking smart city adoption to well-being outcomes is limited. This study exploits the staggered rollout of digital city initiatives across 50 global metropolitan areas between 2015 and 2024 using an event-study difference-in-differences design, with resident well-being measured by validated subjective scales from three annual omnibus surveys (combined n = 380,000). Smart mobility and e-governance features show positive causal effects: a one-standard-deviation increase in smart mobility score raises life satisfaction by 0.11 SD within two years. Conversely, expansion of surveillance infrastructure (CCTV density, biometric check-points) is associated with a significant decrease in perceived privacy autonomy (−0.18 SD) and trust in city government (−0.12 SD) that partially offsets economic efficiency gains. Heterogeneous effects by income tercile reveal that smart city benefits accrue disproportionately to higher-income residents.',
      keywords: 'smart cities, urban well-being, quality of life, e-governance, surveillance, urban analytics',
      doi: '10.55001/gij.v5.12.003',
      page_start: 57,
      page_end: 82,
      submission_date: new Date('2025-10-06'),
      acceptance_date: new Date('2025-12-02'),
      author_ids: [9, 36, 20],
      corresponding: 0,
    },
    {
      issue_idx: 16,
      title: 'Human Germline Gene Editing: Ethical Frameworks, International Governance Proposals, and Scientific Safeguards',
      abstract:
        'The 2018 announcement of the first CRISPR-edited human babies catalysed a global governance crisis, prompting calls for an international framework to regulate heritable human genome editing. This paper provides a comprehensive interdisciplinary analysis spanning bioethics, international law, and genomic science to assess competing governance proposals. We evaluate five major framework proposals from the WHO Expert Advisory Committee, National Academies of Sciences, Nuffield Council on Bioethics, International Commission on Clinical Use of Human Germline Genome Editing, and civil society coalitions using a structured deliberative analysis framework applied to 64 ethical criteria across justice, autonomy, beneficence, and precaution dimensions. No single proposal scores above 58% on all criteria simultaneously; key trade-offs involve balancing patient access in jurisdictions with high disease burden against precautionary slowing of unsafe applications. We propose a modular governance architecture combining national moratoriums on heritable editing for enhancement purposes, expedited regulatory pathways for serious monogenic disease indications, and a binding WHO treaty mechanism for enforcement that addresses current sovereignty loopholes.',
      keywords: 'CRISPR, germline gene editing, bioethics, governance, international law, human enhancement',
      doi: '10.55001/gij.v5.12.004',
      page_start: 83,
      page_end: 110,
      submission_date: new Date('2025-10-20'),
      acceptance_date: new Date('2025-12-10'),
      author_ids: [18, 31, 16],
      corresponding: 0,
    },
    {
      issue_idx: 16,
      title: 'Climate-Smart Agriculture Technology Adoption and Food Security Outcomes in Sub-Saharan Africa: A Meta-Analysis',
      abstract:
        'Sub-Saharan Africa faces a dual challenge of adapting smallholder agriculture to changing climate while simultaneously expanding food production for a rapidly growing population. Climate-smart agriculture (CSA) practices — including conservation tillage, integrated soil fertility management, drought-tolerant varieties, and agroforestry — offer productivity and resilience co-benefits, but adoption remains low. This meta-analysis synthesises 220 impact evaluation studies across 34 sub-Saharan countries covering 2008–2024, estimating average treatment effects on yield, household income, dietary diversity, and greenhouse gas intensity using multi-level random-effects models. CSA adoption increases cereal yields by an average 22.4% (95% CI 18.1–26.7%), household income by 14.8%, and dietary diversity scores by 0.42 standard deviations. GHG intensity per kilocalorie of food produced decreases by 18% on average. Heterogeneity analysis reveals that soil health restoration and crop diversification practices deliver the largest effects in degraded semi-arid landscapes, while irrigation-linked water harvesting dominates in humid zones. Policy pathways for scaling through national agricultural extension, subsidy reform, and insurance bundling are evaluated.',
      keywords: 'climate-smart agriculture, food security, Sub-Saharan Africa, smallholder farming, technology adoption, meta-analysis',
      doi: '10.55001/gij.v5.12.005',
      page_start: 111,
      page_end: 136,
      submission_date: new Date('2025-11-03'),
      acceptance_date: new Date('2025-12-18'),
      author_ids: [8, 25, 28],
      corresponding: 0,
    },
    {
      issue_idx: 16,
      title: 'University-Industry Technology Transfer: Intellectual Property Regimes, Spinout Ecosystem Development, and Policy Levers',
      abstract:
        'University-industry technology transfer (TT) creates significant economic value, yet the determinants of successful knowledge commercialisation vary widely across institutional, national, and disciplinary contexts. This paper analyses a novel longitudinal dataset spanning 142 research-intensive universities across 22 countries over 2000–2024, linking patent portfolios, spinout company performance, licensing revenues, and institutional TT office characteristics. Fixed-effects regression reveals that exclusive licensing strategies increase cumulative royalty income by 38% but reduce knowledge diffusion breadth by 44 percentage points in follow-on patent citations. Spinout companies achieve median revenue of $4.2 million within five years; those originating from universities with formal gap-funding programmes are 2.8× more likely to reach Series A financing. A regression discontinuity exploiting Bayh-Dole-equivalent legislative reforms in nine non-US countries finds that university IP ownership rights increase patent filings by 31% and spinout formation by 19% without reducing academic publication rates. Policy levers including open-access mandates, pro-bono IP legal support, and equity stakes in spinouts are evaluated for their causal effects on both commercialisation and equitable access to university-born innovations.',
      keywords: 'technology transfer, university spinouts, intellectual property, Bayh-Dole, commercialisation, research policy',
      doi: '10.55001/gij.v5.12.006',
      page_start: 137,
      page_end: 162,
      submission_date: new Date('2025-11-15'),
      acceptance_date: new Date('2025-12-28'),
      author_ids: [17, 39, 15],
      corresponding: 1,
    },
  ]

  // Create all articles and author links in a single transaction
  await prisma.$transaction(async (tx) => {
    for (let idx = 0; idx < articles.length; idx++) {
      const art = articles[idx]
      const issue = createdIssues[art.issue_idx]
      process.stdout.write(`  → Article ${idx + 1}/${articles.length}...`)

      const newArticle = await tx.article.create({
        data: {
          issue_id: issue.id,
          title: art.title,
          abstract: art.abstract,
          keywords: art.keywords,
          doi: art.doi,
          page_start: art.page_start,
          page_end: art.page_end,
          submission_date: art.submission_date,
          acceptance_date: art.acceptance_date,
        },
      })
      process.stdout.write(' created...')

      // Link authors
      const authorLinks = art.author_ids.map((authIdx, i) => ({
        article_id: newArticle.id,
        author_id: createdAuthors[authIdx].id,
        order_index: i,
        is_corresponding: i === art.corresponding,
      }))
      await tx.articleAuthor.createMany({ data: authorLinks })
      console.log(' linked ✓')
    }
  }, { timeout: 120000 })
  console.log(`  ✓ ${articles.length} articles created\n`)

  // ── Conferences ──
  console.log('🎤 Creating conferences...')
  const conferences = [
    {
      name: 'International Conference on Artificial Intelligence and Data Science (ICAIDS 2025)',
      description:
        'A premier forum for researchers to present advances in AI, machine learning, data science methodologies, and their applications across various domains.',
      venue: 'Grand Hyatt, Singapore',
      date: new Date('2025-06-15'),
      conference_year: 2025,
    },
    {
      name: 'Global Symposium on Sustainable Technologies (GSST 2025)',
      description:
        'Bringing together leading experts in renewable energy, environmental science, and sustainability engineering to discuss innovative solutions for a greener future.',
      venue: 'Copenhagen Conference Center, Denmark',
      date: new Date('2025-09-20'),
      conference_year: 2025,
    },
    {
      name: 'World Congress on Biomedical Engineering and Digital Health (WCBEDH 2026)',
      description:
        'An interdisciplinary conference exploring the convergence of biomedical engineering, digital health technologies, and AI-driven medical innovations.',
      venue: 'Melbourne Convention Centre, Australia',
      date: new Date('2026-03-10'),
      conference_year: 2026,
    },
    {
      name: 'International Workshop on Cybersecurity and Privacy (IWCP 2026)',
      description:
        'Focused on emerging challenges in cybersecurity, privacy-preserving technologies, and the ethical implications of digital surveillance systems.',
      venue: 'ETH Zurich, Switzerland',
      date: new Date('2026-07-05'),
      conference_year: 2026,
    },
  ]

  await prisma.conference.createMany({ data: conferences })
  console.log(`  ✓ ${conferences.length} conferences created\n`)

  console.log('✅ Seeding complete!')
  console.log('─────────────────────────────')
  console.log(`  Journal:      ${journal.title}`)
  console.log(`  Issues:       ${createdIssues.length}`)
  console.log(`  Articles:     ${articles.length}`)
  console.log(`  Authors:      ${createdAuthors.length}`)
  console.log(`  Board:        ${boardMembers.length}`)
  console.log(`  Conferences:  ${conferences.length}`)
  console.log(`  Admin:        admin / admin123`)
  console.log('─────────────────────────────')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
