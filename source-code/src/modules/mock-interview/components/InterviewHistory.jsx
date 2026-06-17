import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import HistoryIcon from '@mui/icons-material/History';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { POSITIONS } from '../../../shared/constants';
import { SHADOWS, ACCENT_BG } from '../../../theme/theme';

/**
 * InterviewHistory - 面试历史记录组件
 * 展示所有面试记录，可展开查看详情
 */
function InterviewHistory({ records, onDelete }) {
  const [expandedId, setExpandedId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  if (!records || records.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            bgcolor: ACCENT_BG.purple,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <HistoryIcon sx={{ fontSize: 32, color: '#533afd' }} />
        </Box>
        <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500, mb: 0.5 }}>
          暂无面试记录
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 300 }}>
          完成一次模拟面试后，记录将自动保存在这里
        </Typography>
      </Box>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 4) return '#15be53';
    if (score >= 3) return '#f59e0b';
    return '#ea2261';
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
        面试记录 ({records.length})
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {records.map((record) => {
          const isExpanded = expandedId === record.id;
          const positionLabel = POSITIONS.find((p) => p.id === record.position)?.label || record.position;
          const dateStr = record.date ? new Date(record.date).toLocaleString('zh-CN') : '未知日期';
          const score = record.evaluation?.overallScore ?? 0;
          const userMessages = (record.messages || []).filter((m) => m.role === 'user');
          const aiMessages = (record.messages || []).filter((m) => m.role === 'ai');

          return (
            <Card
              key={record.id}
              sx={{
                borderColor: 'divider',
                borderRadius: 2,
                '&:hover': { boxShadow: SHADOWS.light },
              }}
            >
              {/* 记录摘要 */}
              <CardContent sx={{ pb: '12px !important', cursor: 'pointer' }}
                onClick={() => setExpandedId(isExpanded ? null : record.id)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant="h5" sx={{ fontWeight: 300, color: getScoreColor(score), minWidth: 40 }}>
                      {score.toFixed(1)}
                    </Typography>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Chip label={positionLabel} size="small" sx={{
                          fontSize: '0.68rem', height: 20, borderRadius: 1,
                          bgcolor: 'rgba(83,58,253,0.08)', color: '#533afd', fontWeight: 500,
                        }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {userMessages.length} 轮问答
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}>
                        {dateStr}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(record.id); }}
                      sx={{ color: 'text.secondary', '&:hover': { color: '#ea2261' } }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                    {isExpanded ? <ExpandLessIcon sx={{ color: 'text.secondary' }} /> : <ExpandMoreIcon sx={{ color: 'text.secondary' }} />}
                  </Box>
                </Box>
              </CardContent>

              {/* 展开的详情 */}
              <Collapse in={isExpanded}>
                <Box sx={{ px: 2, pb: 2, borderTop: '1px solid', borderColor: 'divider', pt: 1.5 }}>
                  {/* 维度评分 */}
                  {record.evaluation?.dimensions && (
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      {Object.entries(record.evaluation.dimensions).map(([key, val]) => {
                        const labels = { quality: '质量', logic: '逻辑', clarity: '清晰度' };
                        return (
                          <Chip
                            key={key}
                            label={`${labels[key] || key}: ${val}/5`}
                            size="small"
                            sx={{
                              fontSize: '0.68rem', borderRadius: 1,
                              bgcolor: getScoreColor(val) + '15', color: getScoreColor(val), fontWeight: 500,
                            }}
                          />
                        );
                      })}
                    </Box>
                  )}

                  {/* 对话记录 */}
                  <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {(record.messages || []).map((msg, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: 'flex',
                          gap: 1,
                          mb: 1,
                          flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                        }}
                      >
                        <Box sx={{
                          width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          bgcolor: msg.role === 'ai' ? '#533afd' : '#ea2261', color: '#fff',
                        }}>
                          {msg.role === 'ai'
                            ? <SmartToyIcon sx={{ fontSize: 14 }} />
                            : <PersonIcon sx={{ fontSize: 14 }} />}
                        </Box>
                        <Box sx={{
                          maxWidth: '80%', px: 1.5, py: 1, borderRadius: 2,
                          bgcolor: msg.role === 'ai' ? 'action.hover' : '#533afd',
                          color: msg.role === 'ai' ? 'text.primary' : '#fff',
                          border: msg.role === 'ai' ? '1px solid' : 'none',
                          borderColor: 'divider',
                        }}>
                          <Typography variant="body2" sx={{
                            fontSize: '0.8rem', lineHeight: 1.6, fontWeight: 300,
                            color: msg.role === 'ai' ? 'text.primary' : '#fff',
                            whiteSpace: 'pre-wrap',
                          }}>
                            {msg.content}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Collapse>
            </Card>
          );
        })}
      </Box>

      {/* 删除确认弹窗 */}
      <Dialog open={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 500 }}>确认删除</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            确定要删除这条面试记录吗？此操作不可撤销。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)} sx={{ color: 'text.secondary' }}>取消</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => { onDelete(deleteConfirmId); setDeleteConfirmId(null); }}
            sx={{ borderRadius: 2 }}
          >
            删除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default InterviewHistory;
