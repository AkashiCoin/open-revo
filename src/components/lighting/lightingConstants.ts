export interface LightingState {
  kb_enabled: boolean;
  kb_effect: number;
  kb_brightness: number;
  kb_speed: number;
  kb_direction: number;
  kb_color: string;

  // Streamer & Custom Engine
  kb_engine?: 'hardware' | 'streamer' | 'custom';
  kb_fps?: number;
  streamer_effect?: number;
  custom_scale?: number;
  custom_reactive?: boolean;
  custom_script_id?: string;

  // Four-Zone Keyboard Colors
  kb_zones?: [string, string, string, string];

  lb_enabled: boolean;
  lb_effect: number;
  lb_brightness: number;
  lb_speed: number;
  lb_color: string;

  // Rear Vent & Hinge Ambient Light (尾部转轴/出风口氛围灯)
  hinge_enabled: boolean;
  hinge_effect: number;
  hinge_brightness: number;
  hinge_speed: number;
  hinge_color: string;

  logo_enabled: boolean;
  logo_effect: number;
  logo_brightness: number;
  logo_color: string;

  sleep_minutes: number;
  ceremony_enabled?: boolean;
}

export interface KeyboardHardwareInfo {
  hardware_type: string; // 'PerKeyRgb' | 'FourZoneRgb' | 'SingleZoneRgb' | 'SingleColor' | 'None'
  has_ite8291: boolean;
  has_ite7001: boolean;
  has_ite7000?: boolean;
  has_front_lightbar?: boolean;
  is_ec_lightbar?: boolean;
  has_logo?: boolean;
  has_usb_logo?: boolean;
  is_ec_logo?: boolean;
  has_hinge?: boolean;
  is_ec_hinge?: boolean;
  is_four_zone?: boolean;
  description: string;
  brightness_level: number;
  is_on: boolean;
}

// 4-Zone RGB Keyboard Modes (Factory Hardware MCU Effects for ITE 048D:CE00)
export const FOURZONE_KEYBOARD_MODES = [
  { id: 1, name: '单色/四区常亮', desc: '静态纯色照明，支持自定义4分区独立配色' },
  { id: 2, name: '单色呼吸', desc: '平滑渐变光晕律动呼吸' },
  { id: 3, name: '全彩波浪', desc: '4区全彩流动幻彩波' },
  { id: 5, name: '彩虹循环', desc: '4区七彩同步色相环平滑轮播' },
  { id: 12, name: '闪烁跳变', desc: '4区动感闪烁跳变' },
  { id: 13, name: '混合流光', desc: '4区多色交替混合流光' },
];

// Factory Hardware MCU Built-in Effects (Direct ITE 8291 execution, 0% CPU)
export const KEYBOARD_MODES = [
  { id: 1, name: '单色常亮', desc: '经典纯色静态照明' },
  { id: 2, name: '单色呼吸', desc: '平滑渐变光晕呼吸' },
  { id: 3, name: '波浪流光', desc: '全彩流动幻彩波' },
  { id: 4, name: '按键微光', desc: '击键触发局部闪光' },
  { id: 5, name: '彩虹相环', desc: '七彩环形平滑循环' },
  { id: 6, name: '涟漪扩散', desc: '按键为中心向外扩散' },
  { id: 10, name: '随机雨滴', desc: '随机落雨点阵效果' },
  { id: 9, name: '全彩跑马', desc: '全彩循环巡航跑马' },
  { id: 17, name: '璀璨烟花', desc: '指尖绽放璀璨烟火' },
  { id: 14, name: '幽静极光', desc: '幽静平缓流动极光' },
  { id: 21, name: '电竞高亮', desc: 'WASD & 核心电竞键位高亮' },
];

// BetterRGB 60FPS Streamer High-Refresh Effects (100+ Prefix Namespace to isolate from Hardware MCU 1..21)
export const STREAMER_OFFSET = 100;
export const STREAMER_MODES = [
  { id: 101, name: '波浪 (Wave)', desc: '全彩流动幻彩波，支持四向平滑投影' },
  { id: 100, name: '呼吸 (Breath)', desc: '高精度正弦波微光柔和呼吸' },
  { id: 102, name: '涟漪 (Ripple)', desc: '标志性同心圆脉冲，向外平滑扩散' },
  { id: 103, name: '流沙 (Quicksand)', desc: '四重抗锯齿超采样，双正弦干涉超丝滑' },
  { id: 104, name: '电流 (Current)', desc: '八重抗锯齿穿梭脉冲，指数衰减流光' },
  { id: 105, name: '色轮 (Wheel)', desc: '中心极坐标放射旋转彩虹大风车' },
  { id: 106, name: '彩虹 (Rainbow)', desc: '全键同步色相环平滑旋转' },
  { id: 107, name: '矩阵 (Matrix)', desc: '黑客帝国数码雨，动态龙头与余晖' },
  { id: 108, name: '闪电 (Lightning)', desc: '霹雳落雷多分支击落与闪光' },
  { id: 109, name: '火焰 (Flame)', desc: '底部烈焰翻滚向上对流与渐隐' },
  { id: 110, name: '雨滴 (Rain)', desc: '清风细雨随机滴落，水波微澜' },
  { id: 111, name: '星光 (Sparkle)', desc: '全键盘繁星闪烁，微光随机消退' },
  { id: 112, name: '双向电流 (Touch Current)', desc: '双向对冲高频电光脉冲' },
  { id: 113, name: '单色常亮 (Static)', desc: '逐键像素级纯净定色常亮' },
];

export const LIGHTBAR_MODES = [
  { id: 1, name: '单色常亮', desc: '经典纯色静态照明' },
  { id: 2, name: '能量呼吸', desc: '单色柔和光晕律动呼吸' },
  { id: 20, name: '彩虹呼吸', desc: '七彩色相环全光谱渐变呼吸' },
  { id: 3, name: '全彩波浪', desc: '流光溢彩平滑流动波浪' },
  { id: 4, name: '动态对撞', desc: '机身两端向中心对冲碰撞流光' },
  { id: 6, name: '极速流星', desc: '单向流光划破前沿海岸线' },
  { id: 9, name: '跑马流水', desc: '全彩环绕追逐跑马流光' },
  { id: 10, name: '璀璨闪烁', desc: '前沿点阵随机繁星闪烁' },
];

export const LOGO_MODES = [
  { id: 1, name: '单色常亮', desc: '机械革命机械徽标经典常亮' },
  { id: 2, name: '单色呼吸', desc: '指定色彩能量微光缓慢呼吸' },
  { id: 20, name: '彩虹呼吸', desc: '七彩色相环全光谱循环柔和呼吸' },
  { id: 3, name: '全彩波浪', desc: '全彩平滑流动幻彩波' },
  { id: 4, name: '动态对撞', desc: '动感对冲碰撞能量脉冲' },
  { id: 6, name: '穿梭流星', desc: '徽标穿梭流光' },
  { id: 9, name: '全彩跑马', desc: '文字轮廓追逐跑马流光' },
];

// Single-point direct EC PWM badges (e.g. YAOSHI 16 / L16Pro / CANGLONG shield badge)
export const EC_LOGO_MODES = [
  { id: 1, name: '单色常亮', desc: '盾形徽标静态定色持续照明' },
  { id: 2, name: '能量呼吸', desc: '盾形微光淡入淡出韵律呼吸' },
  { id: 20, name: '彩虹呼吸', desc: '盾形徽标全彩循环渐变呼吸' },
];

export const PRESET_COLORS = [
  { name: '机械青', hex: '#00FFFF' },
  { name: '电竞紫', hex: '#6366F1' },
  { name: '极光绿', hex: '#10B981' },
  { name: '烈焰红', hex: '#EF4444' },
  { name: '赛博金', hex: '#F59E0B' },
  { name: '幻影粉', hex: '#EC4899' },
  { name: '冰晶蓝', hex: '#3B82F6' },
  { name: '纯净白', hex: '#FFFFFF' },
];

export const SLEEP_OPTIONS = [
  { label: '从不关闭', value: 0 },
  { label: '1 分钟', value: 1 },
  { label: '5 分钟', value: 5 },
  { label: '10 分钟', value: 10 },
  { label: '15 分钟', value: 15 },
  { label: '30 分钟', value: 30 },
];

export interface BrfxScript {
  id: string;
  name: string;
  author: string;
  description: string;
  version?: string;
  speed: number;       // 0.2 ~ 3.0
  scale: number;       // 0.5 ~ 2.5
  direction: number;   // 0: R, 1: L, 2: U, 3: D
  reactive: boolean;   // Keypress reaction
  color: string;       // "#RRGGBB"
  code: string;
  filePath?: string;
  builtinEffectId?: number; // Corresponding native engine effect ID (e.g. 200, 201, 202)
  customText?: string;
}

