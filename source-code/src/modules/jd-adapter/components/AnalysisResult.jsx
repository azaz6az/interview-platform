import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
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
 * AnalysisResult - Stripe 风格分析结果展示
 * 卡片 6px 圆角 + #e5edf5 边框 + 蓝色调阴影
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

  if (isAnalyzing) {
    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px',
          border: '1px solid #e5edf5',
          boxShadow: 'rgba(23,23,23,0.08) 0px 15px 35px 0px',
        }}
      >
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={56} sx={{ mb: 3, color: '#533afd' }} />
          <Typography variant="h6" sx={{ color: '#533afd', fontWeight: 400, mb: 1 }}>
            正在分析适配度...
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748d', fontWeight: 300 }}>
            AI 正在对比简历与岗位描述的匹配情况
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px',
          border: '2px dashed #e5edf5',
        }}
      >
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <AnalyticsIcon sx={{ fontSize: 64, color: '#e5edf5', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#64748d', fontWeight: 400, mb: 0.5 }}>
            Step 3：分析结果
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748d', fontWeight: 300 }}>
            请先在左侧输入简历和岗位描述，然后点击"分析适配"按钮
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '6px',
        border: '1px solid #e5edf5',
        boxShadow: 'rgba(50,50,93,0.25) 0px 30px 45px -30px, rgba(0,0,0,0.1) 0px 18px 36px -18px',
      }}
    >
      <CardContent sx={{ flex: 1, overflow: 'auto', '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CheckCircleIcon sx={{ color: '#15be53' }} />
          <Typography variant="h6" component="h2" sx={{ fontWeight: 500, color: '#061b31' }}>
            分析结果
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <ScoreGauge score={result.score} />
        </Box>

        <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1.5, color: '#061b31' }}>
          修改建议
        </Typography>

        {result.suggestions.map((suggestion, index) => (
          <SuggestionCard key={index} suggestion={suggestion} index={index} />
        ))}

        <Divider sx={{ my: 3, borderColor: '#e5edf5' }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, color: '#061b31' }}>
            优化后的简历
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={copied ? '已复制！' : '复制到剪贴板'}>
              <Chip
                icon={copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
                label={copied ? '已复制' : '复制简历'}
                onClick={handleCopyResume}
                clickable
                size="small"
                sx={{
                  borderRadius: '4px',
                  fontWeight: 500,
                  ...(copied
                    ? {
                        bgcolor: 'rgba(21,190,83,0.15)',
                        color: '#108c3d',
                        border: '1px solid rgba(21,190,83,0.3)',
                      }
                    : {
                        bgcolor: 'rgba(83,58,253,0.08)',
                        color: '#533afd',
                        border: '1px solid #b9b9f9',
                      }),
                }}
              />
            </Tooltip>
          </Box>
        </Box>

        <Box
          sx={{
            backgroundColor: '#fafbfc',
            borderRadius: '4px',
            p: 2,
            whiteSpace: 'pre-wrap',
            fontSize: '0.9rem',
            lineHeight: 1.8,
            maxHeight: 400,
            overflow: 'auto',
            border: '1px solid #e5edf5',
            color: '#061b31',
            fontWeight: 300,
          }}
        >
          {result.modifiedResume}
        </Box>
      </CardContent>
    </Card>
  );
}

export default AnalysisResult;
