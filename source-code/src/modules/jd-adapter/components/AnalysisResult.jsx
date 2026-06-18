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
import { GRADIENTS, SHADOWS, ACCENT_BG } from '../../../theme/theme';

/**
 * AnalysisResult - 分析结果展示（视觉增强版）
 * 顶部绿色渐变条 + 结果状态渐变 + 优化后简历代码块风格
 */
function AnalysisResult({ result, isAnalyzing, resumeText }) {
  const [copied, setCopied] = useState(false);

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
          borderRadius: 3,
          borderColor: 'divider',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: GRADIENTS.success,
            borderRadius: '12px 12px 0 0',
          },
        }}
      >
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={56} sx={{ mb: 3, color: '#533afd' }} />
          <Typography variant="h6" sx={{ color: '#533afd', fontWeight: 500, mb: 1 }}>
            正在分析适配度...
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 300 }}>
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
          borderRadius: 3,
          border: '2px dashed',
          borderColor: 'divider',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: GRADIENTS.success,
            borderRadius: '12px 12px 0 0',
          },
        }}
      >
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              bgcolor: ACCENT_BG.green,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <AnalyticsIcon sx={{ fontSize: 36, color: '#15be53' }} />
          </Box>
          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 500, mb: 0.5 }}>
            Step 3：分析结果
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 300 }}>
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
        borderRadius: 3,
        borderColor: 'divider',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: GRADIENTS.success,
          borderRadius: '12px 12px 0 0',
        },
      }}
    >
      <CardContent sx={{ flex: 1, overflow: 'auto', '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CheckCircleIcon sx={{ color: '#15be53' }} />
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            分析结果
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <ScoreGauge score={result.score} />
        </Box>

        {/* AI 分析内容（仅 API 模式有） */}
        {result.jdAnalysis && (
          <Box sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main', display: 'block', mb: 0.5 }}>
              📋 JD 核心要求
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 300, lineHeight: 1.7 }}>
              {result.jdAnalysis}
            </Typography>
          </Box>
        )}

        {result.matchAnalysis && (
          <Box sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'secondary.main', display: 'block', mb: 0.5 }}>
              🔍 匹配分析
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 300, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {result.matchAnalysis}
            </Typography>
          </Box>
        )}

        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: 'text.primary' }}>
          {result.jdAnalysis ? 'AI 改进建议' : '修改建议'}
        </Typography>

        {result.suggestions.map((suggestion, index) => (
          <SuggestionCard key={index} suggestion={suggestion} index={index} />
        ))}

        <Divider sx={{ my: 3, borderColor: 'divider' }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {result.jdAnalysis ? 'AI 优化后的简历' : '优化后的简历'}
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
                  borderRadius: 1.5,
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
            backgroundColor: '#f8fafc',
            borderRadius: 2,
            p: 2.5,
            whiteSpace: 'pre-wrap',
            fontSize: '0.9rem',
            lineHeight: 1.8,
            maxHeight: 400,
            overflow: 'auto',
            borderColor: 'divider',
            color: 'text.primary',
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
