import React, { useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useReview } from '../contexts/ReviewContext';
import { useMockInterview } from '../contexts/MockInterviewContext';
import ReviewTimeline from '../modules/review/components/ReviewTimeline';
import ReviewForm from '../modules/review/components/ReviewForm';
import TrendChart from '../modules/review/components/TrendChart';
import WeaknessAnalysis from '../modules/review/components/WeaknessAnalysis';
import { GRADIENTS, SHADOWS, ACCENT_BG } from '../theme/theme';
import EmptyState from '../shared/EmptyState';
import { POSITIONS } from '../shared/constants';

/**
 * ReviewDiaryPage - 复盘日记页面（视觉增强版）
 * 渐变按钮 + 时间线渐变连接线 + 入场动画
 */
function ReviewDiaryPage() {
  const {
    entries,
    weaknesses,
    trend,
    dialogOpen,
    editingEntry,
    addEntry,
    updateEntry,
    deleteEntry,
    computeWeaknesses,
    computeTrend,
    openDialog,
    closeDialog,
  } = useReview();

  const { records: interviewRecords } = useMockInterview();

  // 最近面试记录（取最近 3 次）
  const recentInterviews = useMemo(() => {
    return (interviewRecords || []).slice(-3).reverse();
  }, [interviewRecords]);

  useEffect(() => {
    if (entries.length > 0) {
      computeWeaknesses();
      computeTrend();
    }
  }, [entries, computeWeaknesses, computeTrend]);

  const handleSave = useCallback(
    (formData) => {
      if (editingEntry?.id) {
        updateEntry({ ...formData, id: editingEntry.id });
      } else {
        addEntry(formData);
      }
      closeDialog();
    },
    [editingEntry, addEntry, updateEntry, closeDialog]
  );

  const handleDelete = useCallback(
    (id) => {
      if (window.confirm('确定要删除这条复盘记录吗？')) {
        deleteEntry(id);
      }
    },
    [deleteEntry]
  );

  return (
    <Box>
      {/* 标题栏 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          animation: 'fadeInUp 0.4s ease-out',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 300,
            letterSpacing: '-0.288px',
            color: 'text.primary',
          }}
        >
          复盘日记
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openDialog()}
          sx={{
            borderRadius: 2,
            background: GRADIENTS.primary,
            '&:hover': {
              background: 'linear-gradient(135deg, #4434d4 0%, #6d28d9 100%)',
              boxShadow: SHADOWS.purple,
            },
            fontWeight: 500,
          }}
        >
          新建复盘
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* 左侧：复盘时间线 或 最近面试 */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
              animation: 'fadeInUp 0.4s ease-out 0.05s both',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: GRADIENTS.timeline,
                borderRadius: '12px 12px 0 0',
              },
              '&:hover': { boxShadow: SHADOWS.light },
            }}
          >
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                {entries.length > 0 ? '复盘记录' : '最近面试'}
              </Typography>
              {entries.length > 0 ? (
                <ReviewTimeline entries={entries} onEdit={(entry) => openDialog(entry)} onDelete={handleDelete} />
              ) : recentInterviews.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {recentInterviews.map((record) => {
                    const posLabel = POSITIONS.find((p) => p.id === record.position)?.label || record.position;
                    const dateStr = record.date ? new Date(record.date).toLocaleDateString('zh-CN') : '';
                    const score = record.evaluation?.overallScore ?? 0;
                    return (
                      <Box key={record.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', '&:hover': { bgcolor: 'action.hover' } }}>
                        <Typography variant="h6" sx={{ fontWeight: 300, color: score >= 4 ? '#15be53' : score >= 3 ? '#f59e0b' : '#ea2261', minWidth: 36 }}>{score.toFixed(1)}</Typography>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Chip label={posLabel} size="small" sx={{ fontSize: '0.65rem', height: 18, borderRadius: 1, bgcolor: 'rgba(83,58,253,0.08)', color: 'primary.main', fontWeight: 500 }} />
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{dateStr}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                  <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center', mt: 0.5 }}>
                    在「模拟面试」中完成面试后，记录会自动保存
                  </Typography>
                </Box>
              ) : (
                <EmptyState
                  icon="📝"
                  title="暂无复盘记录"
                  description="完成面试后，记录你的感受和改进点，持续提升"
                  actionLabel="新建复盘"
                  onAction={() => openDialog()}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* 右侧：分析面板 */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* 趋势图 或 面试技巧 */}
            <Card
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                animation: 'fadeInUp 0.4s ease-out 0.1s both',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: GRADIENTS.cool,
                  borderRadius: '12px 12px 0 0',
                },
                '&:hover': { boxShadow: SHADOWS.light },
              }}
            >
              <CardContent>
                {trend.length > 0 ? (
                  <TrendChart data={trend} />
                ) : (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: 'text.primary' }}>
                      面试技巧
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {[
                        { tip: 'STAR 法则', desc: '用情境→任务→行动→结果的结构组织回答' },
                        { tip: '数据量化', desc: '用具体数字支撑你的成果，如"提升转化率 15%"' },
                        { tip: '控制时长', desc: '每道回答控制在 1-3 分钟，重点突出不啰嗦' },
                      ].map((item) => (
                        <Box key={item.tip} sx={{ p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main', display: 'block', mb: 0.25 }}>{item.tip}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>{item.desc}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* 薄弱环节 或 题库分类 */}
            <Card
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                animation: 'fadeInUp 0.4s ease-out 0.15s both',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: GRADIENTS.warm,
                  borderRadius: '12px 12px 0 0',
                },
                '&:hover': { boxShadow: SHADOWS.light },
              }}
            >
              <CardContent>
                <WeaknessAnalysis weaknesses={weaknesses} />
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* 新建/编辑弹窗 */}
      <ReviewForm
        open={dialogOpen}
        editingEntry={editingEntry}
        onSave={handleSave}
        onClose={closeDialog}
      />
    </Box>
  );
}

export default ReviewDiaryPage;
