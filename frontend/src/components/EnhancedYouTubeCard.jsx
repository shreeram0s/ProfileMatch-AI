import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Skeleton,
  Tooltip,
} from '@mui/material';
import {
  PlayCircle,
  OpenInNew,
  OndemandVideo,
} from '@mui/icons-material';

const EnhancedYouTubeCard = ({ video, skill, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="w-full"
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 2.5,
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          '&:hover': {
            boxShadow: '0 12px 32px rgba(59, 130, 246, 0.25)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        {/* Thumbnail Section */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%', // 16:9 aspect ratio
            overflow: 'hidden',
            bgcolor: '#000',
          }}
        >
          {!imageLoaded && (
            <Skeleton
              variant="rectangular"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            />
          )}
          
          {!imageError ? (
            <CardMedia
              component="img"
              image={video.thumbnail}
              alt={video.title}
              onLoad={handleImageLoad}
              onError={handleImageError}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />
          ) : (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(59, 130, 246, 0.1)',
              }}
            >
              <OndemandVideo sx={{ fontSize: 60, color: '#3b82f6' }} />
            </Box>
          )}

          {/* Play Button Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.3)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              '&:hover': {
                opacity: 1,
              },
            }}
          >
            <Tooltip title="Watch on YouTube" arrow>
              <IconButton
                component="a"
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  bgcolor: 'rgba(255, 0, 0, 0.9)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 0, 0, 1)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <PlayCircle sx={{ fontSize: 48, color: 'white' }} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Skill Badge */}
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
            }}
          >
            <Chip
              label={skill}
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.7rem',
                height: '22px',
              }}
            />
          </Box>
        </Box>

        {/* Content Section */}
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              fontSize: '0.95rem',
              lineHeight: 1.3,
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minHeight: '2.6em',
            }}
          >
            {video.title}
          </Typography>

          {video.channel && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 0.5,
                fontSize: '0.8rem',
                fontWeight: 500,
              }}
            >
              {video.channel}
            </Typography>
          )}

          {video.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: '0.75rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                mb: 1.5,
                lineHeight: 1.4,
              }}
            >
              {video.description}
            </Typography>
          )}

          {/* Watch Button */}
          <Box sx={{ mt: 'auto', pt: 1 }}>
            <Tooltip title="Open in YouTube" arrow>
              <IconButton
                component="a"
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: '#3b82f6',
                  padding: '4px 8px',
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: 'rgba(59, 130, 246, 0.1)',
                  },
                }}
              >
                <OpenInNew sx={{ fontSize: 16 }} />
                <Typography
                  variant="caption"
                  sx={{ ml: 0.5, fontWeight: 600, fontSize: '0.7rem' }}
                >
                  Watch
                </Typography>
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EnhancedYouTubeCard;
