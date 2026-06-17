import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  MenuItem,
  Rating,
} from '@mui/material';
import { INTERVIEW_TYPES, POSITIONS } from '../../../shared/constants';
import FeelingRating from './FeelingRating';

/**
 * ReviewForm - 复盘日记表单（弹窗）
 * @param {Object} props
 * @param {boolean} props.open - 是否打开
 * @param {Object|null} props.editingEntry - 编辑中的条目（null 为新建）
 * @param {Function} props.onSave - 保存回调
 * @param {Function} props.onClose - 关闭回调
 */
function ReviewForm({ open, editingEntry, onSave, onClose }) {
  const [form, setForm] = useState(() =>
    editingEntry
      ? { ...editingEntry }
      : {
          interviewType: '',
          category: '',
          date: new Date().toISOString().split('T')[0],
          question: '',
          answer: '',
          feeling: 3,
        }
  );

  /** 更新字段 */
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /** 保存 */
  const handleSave = () => {
    if (!form.question.trim()) return;
    onSave(form);
  };

  // 当 editingEntry 变化时重新初始化
  React.useEffect(() => {
    if (editingEntry) {
      setForm({ ...editingEntry });
    } else {
      setForm({
        interviewType: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        question: '',
        answer: '',
        feeling: 3,
      });
    }
  }, [editingEntry, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 500, color: '#061b31' }}>
        {editingEntry ? '编辑复盘' : '新建复盘'}
      </DialogTitle>
      <DialogContent dividers sx={{ borderColor: '#e5edf5' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {/* 面试类型 */}
          <TextField
            select
            label="面试类型"
            value={form.interviewType}
            onChange={(e) => updateField('interviewType', e.target.value)}
            size="small"
            fullWidth
          >
            {INTERVIEW_TYPES.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.label}
              </MenuItem>
            ))}
          </TextField>

          {/* 岗位方向 */}
          <TextField
            select
            label="岗位方向"
            value={form.category}
            onChange={(e) => updateField('category', e.target.value)}
            size="small"
            fullWidth
          >
            {POSITIONS.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.label}
              </MenuItem>
            ))}
          </TextField>

          {/* 日期 */}
          <TextField
            label="日期"
            type="date"
            value={form.date}
            onChange={(e) => updateField('date', e.target.value)}
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          {/* 题目 */}
          <TextField
            label="面试题目"
            value={form.question}
            onChange={(e) => updateField('question', e.target.value)}
            multiline
            minRows={2}
            fullWidth
            size="small"
            placeholder="请输入面试中遇到的题目..."
          />

          {/* 回答 */}
          <TextField
            label="你的回答"
            value={form.answer}
            onChange={(e) => updateField('answer', e.target.value)}
            multiline
            minRows={3}
            fullWidth
            size="small"
            placeholder="记录你的回答和面试官的反馈..."
          />

          {/* 感受评分 */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#273951', fontWeight: 500 }}>
              感受评分
            </Typography>
            <FeelingRating value={form.feeling} onChange={(v) => updateField('feeling', v)} />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            borderRadius: '4px',
            color: '#64748d',
          }}
        >
          取消
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!form.question.trim()}
          sx={{
            borderRadius: '4px',
            bgcolor: '#533afd',
            '&:hover': { bgcolor: '#4434d4' },
            '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.02)', color: '#64748d' },
            fontWeight: 500,
          }}
        >
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReviewForm;
