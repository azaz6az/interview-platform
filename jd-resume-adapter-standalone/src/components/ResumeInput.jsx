import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  Chip,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';

/**
 * ResumeInput - 简历输入组件
 * @param {Object} props
 * @param {string} props.value - 简历文本
 * @param {Function} props.onChange - 文本变化回调
 * @param {Function} props.onAnalyze - 分析按钮回调
 * @param {boolean} props.isAnalyzing - 是否正在分析
 */
function ResumeInput({ value, onChange, onAnalyze, isAnalyzing }) {
  const charCount = value.length;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '2px solid',
        borderColor: 'primary.light',
        borderRadius: 3,
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          '&:last-child': { pb: 2 },
        }}
      >
        {/* 标题区 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <DescriptionIcon color="primary" />
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
            Step 1：粘贴简历
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          将你的简历内容粘贴到下方文本框中，支持纯文本格式
        </Typography>

        {/* 文本输入区 */}
        <TextField
          multiline
          fullWidth
          minRows={12}
          maxRows={20}
          placeholder="请粘贴你的简历内容...&#10;&#10;示例：&#10;张三 | 大数据管理与应用专业&#10;教育背景：XX大学 2022-2026&#10;技能：Python, SQL, 数据分析&#10;实习经历：XX公司数据分析实习生..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          variant="outlined"
          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              height: '100%',
              alignItems: 'flex-start',
              fontSize: '0.95rem',
              lineHeight: 1.8,
            },
            '& .MuiOutlinedInput-input': {
              fontFamily: 'inherit',
            },
          }}
        />

        {/* 字数统计 */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, gap: 1 }}>
          <Chip
            label={`${charCount} 字`}
            size="small"
            variant="outlined"
            color={charCount > 0 ? 'primary' : 'default'}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

export default ResumeInput;
