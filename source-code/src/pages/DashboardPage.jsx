import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import RateReviewIcon from '@mui/icons-material/RateReview';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useJdAdapter } from '../contexts/JdAdapterContext';
import { useMockInterview } from '../contexts/MockInterviewContext';
import { useQuestionBank } from '../contexts/QuestionBankContext';
import { useReview } from '../contexts/ReviewContext';

/** 快捷入口卡片配置 — Stripe Purple 图标底色统一 */
const QUICK_ENTRIES = [
  {
    title: 'JD 简历适配',
    description: '对比简历与岗位描述，获取修改建议',
    icon: <WorkOutlineIcon sx={{ fontSize: 36 }} />,
    path: '/jd-adapter',
    iconBgColor: 'rgba(83,58,253,0.08)',
    iconColor: '#533afd',
  },
  {
    title: 'AI 模拟面试',
    description: '多轮对话式模拟面试，获取评分反馈',
    icon: <QuestionAnswerIcon sx={{ fontSize: 36 }} />,
    path: '/mock-interview',
    iconBgColor: 'rgba(83,58,253,0.08)',
    iconColor: '#533afd',
  },
  {
    title: '面试题库',
    description: '50+ 精选面试题，按岗位和难度分类',
    icon: <LibraryBooksIcon sx={{ fontSize: 36 }} />,
    path: '/question-bank',
    iconBgColor: 'rgba(83,58,253,0.08)',
    iconColor: '#533afd',
  },
  {
    title: '复盘日记',
    description: '记录面试经历，分析薄弱环节',
    icon: <RateReviewIcon sx={{ fontSize: 36 }} />,
    path: '/review-diary',
    iconBgColor: 'rgba(83,58,253,0.08)',
    iconColor: '#533afd',
  },
];

/**
 * DashboardPage - Stripe 风格仪表盘
 * 标题 weight 300 + Deep Navy + 负 letter-spacing
 * 卡片白底 + #e5edf5 边框 + 6px 圆角 + 蓝色调阴影
 * 使用建议区：Brand Dark #1c1e54 深色背景 + 白色文字
 */
function DashboardPage() {
  const navigate = useNavigate();
  const { analysisResult } = useJdAdapter();
  const { records } = useMockInterview();
  const { favorites } = useQuestionBank();
  const { entries } = useReview();

  return (
    <Box>
      {/* 欢迎区 — Stripe 标题风格：weight 300 + 负 letter-spacing */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 300,
            letterSpacing: '-0.96px',
            color: '#061b31',
            mb: 1,
          }}
        >
          面面俱到
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748d', fontWeight: 300 }}>
          大学生面试备战平台 — 从简历优化到模拟面试，一站式面试准备
        </Typography>
      </Box>

      {/* 快捷入口 — Stripe 卡片风格 */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {QUICK_ENTRIES.map((entry) => (
          <Grid item xs={12} sm={6} md={3} key={entry.path}>
            <Card
              onClick={() => navigate(entry.path)}
              sx={{
                cursor: 'pointer',
                border: '1px solid #e5edf5',
                borderRadius: '6px',
                boxShadow: 'rgba(23,23,23,0.08) 0px 15px 35px 0px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 'rgba(50,50,93,0.25) 0px 30px 45px -30px, rgba(0,0,0,0.1) 0px 18px 36px -18px',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 56,
                    height: 56,
                    borderRadius: '8px',
                    bgcolor: entry.iconBgColor,
                    color: entry.iconColor,
                    mb: 1.5,
                  }}
                >
                  {entry.icon}
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#061b31', mb: 0.5 }}>
                  {entry.title}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#64748d' }}>
                  {entry.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 数据概览 — Deep Navy 数字 */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 400,
          mb: 2,
          color: '#061b31',
          letterSpacing: '-0.01em',
        }}
      >
        数据概览
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <Card sx={{ border: '1px solid #e5edf5', borderRadius: '6px' }}>
            <CardContent sx={{ textAlign: 'center', '&:last-child': { pb: 2 } }}>
              <Typography variant="h3" sx={{ fontWeight: 300, color: '#061b31', letterSpacing: '-0.64px' }}>
                {analysisResult ? analysisResult.score : '-'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748d' }}>
                最新适配分
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ border: '1px solid #e5edf5', borderRadius: '6px' }}>
            <CardContent sx={{ textAlign: 'center', '&:last-child': { pb: 2 } }}>
              <Typography variant="h3" sx={{ fontWeight: 300, color: '#061b31', letterSpacing: '-0.64px' }}>
                {records.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748d' }}>
                模拟面试次数
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ border: '1px solid #e5edf5', borderRadius: '6px' }}>
            <CardContent sx={{ textAlign: 'center', '&:last-child': { pb: 2 } }}>
              <Typography variant="h3" sx={{ fontWeight: 300, color: '#061b31', letterSpacing: '-0.64px' }}>
                {favorites.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748d' }}>
                收藏题目
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ border: '1px solid #e5edf5', borderRadius: '6px' }}>
            <CardContent sx={{ textAlign: 'center', '&:last-child': { pb: 2 } }}>
              <Typography variant="h3" sx={{ fontWeight: 300, color: '#061b31', letterSpacing: '-0.64px' }}>
                {entries.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748d' }}>
                复盘记录
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 使用建议区域 — Brand Dark #1c1e54 深色背景 + 白色文字 */}
      <Box
        sx={{
          mt: 4,
          p: 3,
          borderRadius: '8px',
          bgcolor: '#1c1e54',
          color: '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <TrendingUpIcon sx={{ color: '#fff' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 500, color: '#fff' }}>
            使用建议
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ lineHeight: 1.8, color: 'rgba(255,255,255,0.85)' }}>
          1. 先用「JD 简历适配」优化简历，提高通过率<br />
          2. 通过「面试题库」浏览和收藏高频题目<br />
          3. 使用「AI 模拟面试」进行多轮练习，获取评分反馈<br />
          4. 每次面试后写「复盘日记」，持续改进薄弱环节
        </Typography>
      </Box>
    </Box>
  );
}

export default DashboardPage;
