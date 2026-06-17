import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  Chip,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

/**
 * JDInput - 岗位描述输入组件
 * @param {Object} props
 * @param {string} props.value - JD 文本
 * @param {Function} props.onChange - 文本变化回调
 * @param {Function} props.onAnalyze - 分析按钮回调
 * @param {boolean} props.isAnalyzing - 是否正在分析
 */
function JDInput({ value, onChange, onAnalyze, isAnalyzing }) {
  const charCount = value.length;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '2px solid',
        borderColor: 'secondary.light',
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
          <WorkIcon color="secondary" />
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
            Step 2：粘贴岗位描述
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          将目标岗位的 JD 粘贴到下方，系统会自动提取关键信息
        </Typography>

        {/* 文本输入区 */}
        <TextField
          multiline
          fullWidth
          minRows={12}
          maxRows={20}
          placeholder="请粘贴岗位描述(JD)...&#10;&#10;示例：&#10;岗位：数据分析师&#10;职责：&#10;1. 负责公司业务数据的收集、清洗和分析&#10;2. 搭建数据看板，监控核心业务指标&#10;要求：&#10;1. 本科及以上学历，统计学/数学/计算机相关专业&#10;2. 熟练使用 SQL、Python 进行数据处理..."
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
            color={charCount > 0 ? 'secondary' : 'default'}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

export default JDInput;
