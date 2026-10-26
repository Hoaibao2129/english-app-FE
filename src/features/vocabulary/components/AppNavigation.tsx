import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined'
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'
import HeadphonesOutlinedIcon from '@mui/icons-material/HeadphonesOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import {
  Box,
  Chip,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'

export const navigationWidth = 224

interface AppNavigationProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

const navigationItems = [
  {
    label: 'Trang chủ',
    icon: <HomeOutlinedIcon />,
    active: false,
    comingSoon: false,
  },
  {
    label: '1000 từ vựng',
    icon: <AutoStoriesOutlinedIcon />,
    active: true,
    comingSoon: false,
  },
  {
    label: 'Ngữ pháp',
    icon: <MenuBookOutlinedIcon />,
    active: false,
    comingSoon: true,
  },
  {
    label: 'Luyện nghe',
    icon: <HeadphonesOutlinedIcon />,
    active: false,
    comingSoon: true,
  },
  {
    label: 'Thống kê',
    icon: <BarChartOutlinedIcon />,
    active: false,
    comingSoon: true,
  },
]

function NavigationContent() {
  return (
    <Box sx={{ height: '100%', px: 2, py: 3 }}>
      <Typography
        variant="h6"
        fontWeight={800}
        sx={{ px: 1.5, mb: 3, letterSpacing: '-0.02em' }}
      >
        Study English
      </Typography>

      <List disablePadding>
        {navigationItems.map((item) => (
          <ListItemButton
            key={item.label}
            selected={item.active}
            disabled={item.comingSoon}
            sx={{
              minHeight: 44,
              borderRadius: 2,
              mb: 0.75,
              px: 1.5,
              '&.Mui-selected': {
                color: 'primary.main',
                bgcolor: '#EEEEFF',
                '&:hover': { bgcolor: '#E8E8FF' },
              },
              '&.Mui-disabled': { opacity: 0.62 },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 34,
                color: item.active ? 'primary.main' : 'text.secondary',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              slotProps={{
                primary: {
                  fontSize: 14,
                  fontWeight: item.active ? 750 : 600,
                },
              }}
            />
            {item.comingSoon && (
              <Chip
                label="Sắp có"
                size="small"
                sx={{ height: 21, fontSize: 10, fontWeight: 700 }}
              />
            )}
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ mt: 3 }} />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', px: 1.5, mt: 2 }}
      >
        Học mỗi ngày, tiến bộ mỗi ngày.
      </Typography>
    </Box>
  )
}

export function AppNavigation({
  mobileOpen,
  onMobileClose,
}: AppNavigationProps) {
  return (
    <Box
      component="nav"
      sx={{ width: { md: navigationWidth }, flexShrink: { md: 0 } }}
      aria-label="Điều hướng chính"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: navigationWidth,
            borderRightColor: 'divider',
          },
        }}
      >
        <NavigationContent />
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: navigationWidth,
            boxSizing: 'border-box',
            borderRightColor: 'divider',
          },
        }}
      >
        <NavigationContent />
      </Drawer>
    </Box>
  )
}
