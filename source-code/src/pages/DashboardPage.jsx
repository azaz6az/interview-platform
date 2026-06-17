import React, { useMemo } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import RateReviewIcon from '@mui/icons-material/RateReview';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useJdAdapter } from '../contexts/JdAdapterContext';
import { useMockInterview } from '../contexts/MockInterviewContext';
import { useQuestionBank } from '../contexts/QuestionBankContext';
import { useReview } from '../contexts/ReviewContext';
import { GRADIENTS, SHADOWS, ACCENT_BG } from '../theme/theme';
import JobSiteLinks from '../shared/JobSiteLinks';
import questionsData from '../modules/question-bank/data/questions.json';

/** 每日推荐题目（用日期做 seed 保证同一天推荐相同） */
function getDailyQuestions(count = 3) {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const shuffled = [...questionsData].sort((a, b) => {
    const ha = ((seed * 9301 + a.id.charCodeAt(1) * 49297) % 233280) / 233280;
    const hb = ((seed * 9301 + b.id.charCodeAt(1) * 49297) % 233280) / 233280;
    return ha - hb;
  });
  return shuffled.slice(0, count);
}

const QUICK_ENTRIES = [
  { title: 'JD 简历适配', description: '对比简历与岗位描述，获取修改建议', icon: <WorkOutlineIcon sx={{ fontSize: 36 }} />, path: '/jd-adapter', gradient: GRADIENTS.primary, iconBg: ACCENT_BG.purple, iconColor: '#533afd', accentColor: '#533afd' },
  { title: 'AI 模拟面试', description: '多轮对话式模拟面试，获取评分反馈', icon: <QuestionAnswerIcon sx={{ fontSize: 36 }} />, path: '/mock-interview', gradient: GRADIENTS.warm, iconBg: ACCENT_BG.pink, iconColor: '#ea2261', accentColor: '#ea2261' },
  { title: '面试题库', description: '50+ 精选面试题，按岗位和难度分类', icon: <LibraryBooksIcon sx={{ fontSize: 36 }} />, path: '/question-bank', gradient: GRADIENTS.cool, iconBg: ACCENT_BG.blue, iconColor: '#3b82f6', accentColor: '#3b82f6' },
  { title: '复盘日记', description: '记录面试经历，分析薄弱环节', icon: <RateReviewIcon sx={{ fontSize: 36 }} />, path: '/review-diary', gradient: GRADIENTS.success, iconBg: ACCENT_BG.green, iconColor: '#108c3d', accentColor: '#15be53' },
];

const STAT_CARDS = [
  { key: 'score', label: '最新适配分', color: '#533afd', bg: ACCENT_BG.purple },
  { key: 'records', label: '模拟面试次数', color: '#ea2261', bg: ACCENT_BG.pink },
  { key: 'favorites', label: '收藏题目', color: '#3b82f6', bg: ACCENT_BG.blue },
  { key: 'entries', label: '复盘记录', color: '#15be53', bg: ACCENT_BG.green },
];

function DashboardPage() {
  const navigate = useNavigate();
  const { analysisResult } = useJdAdapter();
  const { records } = useMockInterview();
  const { favorites, selectQuestion } = useQuestionBank();
  const { entries } = useReview();

  const dailyQuestions = useMemo(() => getDailyQuestions(3), []);

  const statValues = {
    score: analysisResult ? analysisResult.score : '-',
    records: records.length,
    favorites: favorites.length,
    entries: entries.length,
  };

  return (
    <Box>
      {/* Hero */}
      <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 3, mb: 4, p: { xs: 3, md: 4 }, background: GRADIENTS.hero, color: '#fff', animation: 'fadeInUp 0.5s ease-out' }}>
        <Box sx={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <Box sx={{ position: 'absolute', bottom: -60, right: 80, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 300, letterSpacing: '-0.96px', color: '#fff', mb: 1 }}>面面俱到</Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 300, maxWidth: 500 }}>
            大学生面试备战平台 — 从简历优化到模拟面试，一站式面试准备
          </Typography>
        </Box>
      </Box>

      {/* 快捷入口 */}
      <Typography variant="h6" sx={{ fontWeight: 500, mb: 2, color: 'text.primary' }}>快速开始</Typography>
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {QUICK_ENTRIES.map((entry, idx) => (
          <Grid item xs={12} sm={6} md={3} key={entry.path}>
            <Card onClick={() => navigate(entry.path)} sx={{ cursor: 'pointer', position: 'relative', borderRadius: 3, animation: `fadeInUp 0.5s ease-out ${idx * 0.08}s both`, '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: entry.gradient, borderRadius: '12px 12px 0 0' }, '&:hover': { transform: 'translateY(-6px)', boxShadow: SHADOWS.purple, borderColor: 'transparent' } }}>
              <CardContent sx={{ textAlign: 'center', py: 3.5 }}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 60, height: 60, borderRadius: 2.5, bgcolor: entry.iconBg, color: entry.iconColor, mb: 1.5 }}>{entry.icon}</Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>{entry.title}</Typography>
                <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary', fontWeight: 300 }}>{entry.description}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 1.5, color: entry.accentColor, fontSize: '0.75rem', fontWeight: 500, opacity: 0.7 }}>
                  开始使用 <ArrowForwardIcon sx={{ fontSize: 14 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 数据概览 */}
      <Typography variant="h6" sx={{ fontWeight: 500, mb: 2, color: 'text.primary' }}>数据概览</Typography>
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {STAT_CARDS.map((stat, idx) => (
          <Grid item xs={6} sm={3} key={stat.key}>
            <Card sx={{ position: 'relative', borderRadius: 3, animation: `fadeInUp 0.5s ease-out ${0.3 + idx * 0.08}s both`, overflow: 'hidden', '&::before': { content: '""', position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: stat.color, borderRadius: '4px 0 0 4px' }, '&:hover': { transform: 'translateY(-3px)', boxShadow: SHADOWS.light } }}>
              <CardContent sx={{ textAlign: 'center', '&:last-child': { pb: 2 }, pl: 2.5 }}>
                <Typography variant="h3" sx={{ fontWeight: 300, color: stat.color, letterSpacing: '-0.64px', fontVariantNumeric: 'tabular-nums' }}>
                  {statValues[stat.key]}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 300 }}>{stat.label}</Typography>
                {/* 数据为 0 时的引导链接 */}
                {statValues[stat.key] === 0 && (
                  <Chip
                    label={stat.key === 'records' ? '去面试' : stat.key === 'favorites' ? '去题库' : '去复盘'}
                    size="small"
                    onClick={() => navigate(stat.key === 'records' ? '/mock-interview' : stat.key === 'favorites' ? '/question-bank' : '/review-diary')}
                    sx={{ mt: 0.5, fontSize: '0.65rem', height: 20, borderRadius: 1, cursor: 'pointer', bgcolor: `${stat.color}15`, color: stat.color, fontWeight: 500 }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 今日推荐题目 + 招聘网站 */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 2, color: 'text.primary' }}>今日推荐</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {dailyQuestions.map((q, idx) => (
              <Card key={q.id} onClick={() => selectQuestion(q)} sx={{ cursor: 'pointer', borderRadius: 2, animation: `fadeInUp 0.5s ease-out ${0.5 + idx * 0.08}s both`, '&:hover': { boxShadow: SHADOWS.light } }}>
                <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 }, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Chip label={q.difficulty === 'easy' ? '入门' : q.difficulty === 'medium' ? '进阶' : '挑战'} size="small" sx={{ fontSize: '0.65rem', height: 20, borderRadius: 1, bgcolor: (q.difficulty === 'easy' ? '#15be53' : q.difficulty === 'medium' ? '#3b82f6' : '#ea2261') + '18', color: q.difficulty === 'easy' ? '#15be53' : q.difficulty === 'medium' ? '#3b82f6' : '#ea2261', fontWeight: 500, flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ flex: 1, fontWeight: 400, color: 'text.primary', fontSize: '0.85rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {q.question}
                  </Typography>
                  <ArrowForwardIcon sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 2, color: 'text.primary' }}>求职导航</Typography>
          <JobSiteLinks />
        </Grid>
      </Grid>

      {/* 使用建议 */}
      <Box sx={{ position: 'relative', overflow: 'hidden', mt: 4, p: 3.5, borderRadius: 3, background: 'linear-gradient(135deg, #1c1e54 0%, #2d1b69 50%, #1c1e54 100%)', color: '#ffffff', animation: 'fadeInUp 0.5s ease-out 0.6s both' }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <TrendingUpIcon sx={{ color: 'rgba(255,255,255,0.9)' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#fff' }}>使用建议</Typography>
          </Box>
          <Box component="ol" sx={{ m: 0, pl: 2.5, '& li': { mb: 1, color: 'rgba(255,255,255,0.85)', fontWeight: 300, fontSize: '0.9rem', lineHeight: 1.7 }, '& li:last-child': { mb: 0 } }}>
            <li>先用「JD 简历适配」优化简历，提高通过率</li>
            <li>通过「面试题库」浏览和收藏高频题目</li>
            <li>使用「AI 模拟面试」进行多轮练习，获取评分反馈</li>
            <li>每次面试后写「复盘日记」，持续改进薄弱环节</li>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default DashboardPage;
