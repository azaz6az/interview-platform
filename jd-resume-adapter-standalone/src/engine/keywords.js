/**
 * keywords.js - 内置求职关键词库
 * 按岗位方向分类，用于 JD 与简历的关键词匹配分析
 */

/** 技术类关键词 */
export const TECH_KEYWORDS = [
  // 编程语言
  'Python', 'Java', 'SQL', 'R', 'Scala', 'Go', 'JavaScript', 'C++',
  'C语言', 'MATLAB', 'Shell', 'Bash',
  // 大数据技术
  'Hadoop', 'Spark', 'Flink', 'Kafka', 'Hive', 'HBase', 'Zookeeper',
  'Storm', 'Presto', 'ClickHouse', 'Doris', 'Impala',
  // 数据分析与可视化
  'Tableau', 'Power BI', 'Excel', 'SPSS', 'SAS', 'ECharts', 'D3.js',
  'Matplotlib', 'Seaborn', 'Pandas', 'NumPy', 'Scikit-learn',
  // 机器学习与AI
  '机器学习', '深度学习', '自然语言处理', 'NLP', '计算机视觉', 'CV',
  'TensorFlow', 'PyTorch', 'Keras', 'XGBoost', 'LightGBM',
  '推荐系统', '知识图谱', '大模型', 'LLM', 'GPT',
  // 数据库
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server',
  'NoSQL', '图数据库',
  // 开发与运维
  'Docker', 'Kubernetes', 'Git', 'Linux', 'CI/CD', 'DevOps',
  'Airflow', 'Docker Compose',
];

/** 通用软技能关键词 */
export const SOFT_SKILL_KEYWORDS = [
  '沟通能力', '团队协作', '项目管理', '问题解决', '数据驱动',
  '责任心', '学习能力', '抗压能力', '创新思维', '逻辑思维',
  '跨部门协作', '领导力', '执行力', '主动性', '适应能力',
  '分析能力', '时间管理', '目标导向', '结果导向', '细节导向',
  '自驱力', '影响力', '谈判能力', '演讲能力', '文档能力',
];

/** 数据类关键词（大数据管理与应用专业方向） */
export const DATA_KEYWORDS = [
  // 数据治理
  '数据治理', '数据质量', '数据标准', '数据安全', '数据合规',
  '数据资产', '元数据管理', '数据血缘', '数据目录',
  // 数据仓库与ETL
  '数据仓库', 'ETL', 'ELT', '数据湖', '数据集成', '数据清洗',
  '数据转换', '数仓建模', '维度建模', '星型模型', '雪花模型',
  // 数据建模与分析
  '数据建模', '数据分析', '数据挖掘', '统计分析', 'A/B测试',
  '回归分析', '聚类分析', '分类模型', '预测模型', '特征工程',
  // BI与指标
  'BI', '商业智能', '指标体系', '数据看板', '报表', '仪表盘',
  '数据可视化', '数据报告', '数据驾驶舱', 'OKR', 'KPI',
  // 业务场景
  '用户画像', '漏斗分析', '留存分析', '归因分析', '同期群分析',
  'RFM模型', '增长分析', '运营分析', '风控', '反欺诈',
];

/** 经验要求关键词 */
export const EXPERIENCE_KEYWORDS = [
  '实习', '项目经验', '工作经验', '校招', '社招',
  '本科', '硕士', '博士', '985', '211',
  '1年', '2年', '3年', '5年',
  '优先', '加分项', '必须', '要求',
];

/**
 * 获取所有关键词的合集（去重）
 * @returns {string[]} 所有关键词数组
 */
export function getAllKeywords() {
  const all = [
    ...TECH_KEYWORDS,
    ...SOFT_SKILL_KEYWORDS,
    ...DATA_KEYWORDS,
    ...EXPERIENCE_KEYWORDS,
  ];
  return [...new Set(all)];
}

/**
 * 按类别获取关键词
 * @returns {Object} 分类关键词对象
 */
export function getKeywordsByCategory() {
  return {
    tech: TECH_KEYWORDS,
    softSkill: SOFT_SKILL_KEYWORDS,
    data: DATA_KEYWORDS,
    experience: EXPERIENCE_KEYWORDS,
  };
}
