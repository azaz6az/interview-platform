import React from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const JOB_SITES = [
  { name: 'BOSS直聘', url: 'https://www.zhipin.com', color: '#00b38a', emoji: '💼' },
  { name: '牛客网', url: 'https://www.nowcoder.com', color: '#ff6a00', emoji: '🐂' },
  { name: '实习僧', url: 'https://www.shixiseng.com', color: '#4e6ef2', emoji: '🎓' },
  { name: '拉勾', url: 'https://www.lagou.com', color: '#00b38a', emoji: '🔗' },
];

/**
 * JobSiteLinks - 招聘网站快捷导航
 */
function JobSiteLinks({ compact = false }) {
  return (
    <Box>
      {!compact && (
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
          招聘网站
        </Typography>
      )}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        {JOB_SITES.map((site) => (
          <Tooltip key={site.name} title={`打开 ${site.name}`} arrow>
            <Box
              component="a"
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.5,
                py: 1,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                textDecoration: 'none',
                color: 'text.primary',
                fontSize: '0.8rem',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: site.color,
                  boxShadow: 2,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <span>{site.emoji}</span>
              <span>{site.name}</span>
              <OpenInNewIcon sx={{ fontSize: 14, color: 'text.secondary', ml: 0.25 }} />
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
}

export default JobSiteLinks;
