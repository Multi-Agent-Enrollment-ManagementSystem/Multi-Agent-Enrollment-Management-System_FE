import { Typography } from "antd";
import { Sparkles } from "lucide-react";
import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";
import type { ComponentProps } from "react";

const { Title, Paragraph, Text } = Typography;

/** Cấu hình shader — giữ nguyên props runtime từ thiết kế gốc; thư viện thiếu type đầy đủ. */
const heroShaderProps = {
  control: "props",
  animate: "on",
  brightness: 1.1,
  cAzimuthAngle: 180,
  cDistance: 3.9,
  cPolarAngle: 115,
  color1: "#5606ff",
  color2: "#fe8989",
  color3: "#000000",
  destination: "onCanvas",
  embedMode: "off",
  envPreset: "city",
  format: "gif",
  fov: 45,
  frameRate: 10,
  gizmoHelper: "hide",
  grain: "off",
  lightType: "3d",
  pixelDensity: 1,
  positionX: -0.5,
  positionY: 0.1,
  positionZ: 0,
  range: "disabled",
  rangeEnd: 40,
  rangeStart: 0,
  reflection: 0.1,
  rotationX: 0,
  rotationY: 0,
  rotationZ: 235,
  shader: "defaults",
  type: "waterPlane",
  uAmplitude: 0,
  uDensity: 1.1,
  uFrequency: 5.5,
  uSpeed: 0.1,
  uStrength: 2.4,
  uTime: 0.2,
  wireframe: false,
} as ComponentProps<typeof ShaderGradient>;

/** Hero full-viewport với shader gradient — giới thiệu trang chương trình đào tạo. */
export function ProgramListHero() {
  return (
    <section className="relative min-h-screen px-6 overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/90 via-orange-700/75 to-gray-900/90" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* pointer-events-none: không bắt scroll/zoom chuột — trang cuộn bình thường */}
      <ShaderGradientCanvas
        className="pointer-events-none"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        pixelDensity={1.5}
        fov={45}
      >
        <ShaderGradient {...heroShaderProps} />
      </ShaderGradientCanvas>
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
          <Sparkles size={14} className="text-orange-300" />
          <Text className="!text-orange-200 text-sm font-medium">
            Trường Đại học FPT — Đào tạo chất lượng quốc tế
          </Text>
        </div>
        <Title
          level={1}
          className="!text-white !text-4xl md:!text-5xl !font-extrabold !leading-tight !mb-4"
        >
          Chương trình <span className="text-orange-400">Đào tạo</span>
        </Title>
        <Paragraph className="!text-gray-200 text-lg max-w-2xl mx-auto !mb-0">
          Khám phá các ngành học tiên tiến, gắn kết doanh nghiệp và định hướng
          nghề nghiệp rõ ràng tại Đại học FPT.
        </Paragraph>
      </div>
    </section>
  );
}
