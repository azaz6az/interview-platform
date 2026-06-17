import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  Divider,
  Chip,
  Tooltip,
} from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScoreGauge from './ScoreGauge';
import SuggestionCard from './SuggestionCard';

/**
 * AnalysisResult - 分析结果展示组件
 * @param {Object} props
 * @param {Object|null} props.result - 分析结果对象
 * @param {boolean} props.isAnalyzing - 是否正在分析
 * @param {string} props.resumeText - 原始简历文本
 */
function AnalysisResult({ result, isAnalyzing, resumeText }) {
  const [copied, setCopied] = useState(false);

  /** 一键复制修改后的简历到剪贴板 */
  const handleCopyResume = async () => {
    if (!result?.modifiedResume) return;
    try {
      await navigator.clipboard.writeText(result.modifiedResume);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 兼容不支持 clipboard API 的浏览器
      const textarea = document.createElement('textarea');
      textarea.value = result.modifiedResume;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 正在分析中的加载态
  if (isAnalyzing) {
    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={56} sx={{ mb: 3 }} />
          <Typography variant="h6" color="primary" gutterBottom>
            正在分析适配度...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            AI 正在对比简历与岗位描述的匹配情况
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // 空状态
  if (!result) {
    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 3,
          border: '2px dashed',
          borderColor: 'grey.300',
        }}
      >
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <AnalyticsIcon sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Step 3：分析结果
          </Typography>
          <Typography variant="body2" color="text.secondary">
            请先在左侧输入简历和岗位描述，然后点击"分析适配"按钮
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // 有结果时渲染
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        border: '2px solid',
        borderColor: 'success.light',
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          overflow: 'auto',
          '&:last-child': { pb: 2 },
        }}
      >
        {/* 标题区 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CheckCircleIcon color="success" />
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
            分析结果
          </Typography>
        </Box>

        {/* 匹配度评分 */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <ScoreGauge score={result.score} />
        </Box>

        {/* 修改建议列表 */}
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
          修改建议
        </Typography>

        {result.suggestions.map((suggestion, index) => (
          <SuggestionCard key={index} suggestion={suggestion} index={index} />
        ))}

        <Divider sx={{ my: 3 }} />

        {/* 修改后简历预览 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            优化后的简历
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={copied ? '已复制！' : '复制到剪贴板'}>
              <Chip
                icon={copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
                label={copied ? '已复制' : '复制简历'}
                color={copied ? 'success' : 'primary'}
                variant={copied ? 'filled' : 'outlined'}
                onClick={handleCopyResume}
                clickable
                size="small"
              />
            </Tooltip>
          </Box>
        </Box>

        <Box
          sx={{
            backgroundColor: '#f8f9fa',
            borderRadius: 2,
            p: 2,
            whiteSpace: 'pre-wrap',
            fontSize: '0.9rem',
            lineHeight: 1.8,
            maxHeight: 400,
            overflow: 'auto',
            border: '1px solid #e0e0e0',
          }}
        >
          {result.modifiedResume}
        </Box>
      </CardContent>
    </Card>
  );
}

export default AnalysisResult;
