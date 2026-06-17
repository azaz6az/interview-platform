import React, { useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useReview } from '../contexts/ReviewContext';
import ReviewTimeline from '../modules/review/components/ReviewTimeline';
import ReviewForm from '../modules/review/components/ReviewForm';
import TrendChart from '../modules/review/components/TrendChart';
import WeaknessAnalysis from '../modules/review/components/WeaknessAnalysis';

/**
 * ReviewDiaryPage - Stripe 风格复盘日记页面
 * 标题 weight 300 + 负 letter-spacing
 * 新建复盘按钮 Stripe Purple CTA
 * 卡片 Stripe 蓝色阴影
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

  /** 加载后自动计算趋势和薄弱环节 */
  useEffect(() => {
    if (entries.length > 0) {
      computeWeaknesses();
      computeTrend();
    }
  }, [entries, computeWeaknesses, computeTrend]);

  /** 保存复盘条目 */
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

  /** 删除条目 */
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
      {/* 标题栏 — Stripe 风格 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 300,
            letterSpacing: '-0.288px',
            color: '#061b31',
          }}
        >
          复盘日记
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openDialog()}
          sx={{
            borderRadius: '4px',
            bgcolor: '#533afd',
            '&:hover': { bgcolor: '#4434d4' },
            fontWeight: 500,
          }}
        >
          新建复盘
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* 左侧：复盘时间线 — Stripe 风格竖线 + 圆点 */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              border: '1px solid #e5edf5',
              borderRadius: '6px',
              boxShadow: 'rgba(23,23,23,0.08) 0px 15px 35px 0px',
            }}
          >
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 2, color: '#061b31' }}>
                复盘记录
              </Typography>
              <ReviewTimeline
                entries={entries}
                onEdit={(entry) => openDialog(entry)}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* 右侧：分析面板 */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* 趋势图 */}
            <Card
              sx={{
                border: '1px solid #e5edf5',
                borderRadius: '6px',
                boxShadow: 'rgba(23,23,23,0.08) 0px 15px 35px 0px',
              }}
            >
              <CardContent>
                <TrendChart data={trend} />
              </CardContent>
            </Card>

            {/* 薄弱环节 */}
            <Card
              sx={{
                border: '1px solid #e5edf5',
                borderRadius: '6px',
                boxShadow: 'rgba(23,23,23,0.08) 0px 15px 35px 0px',
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
