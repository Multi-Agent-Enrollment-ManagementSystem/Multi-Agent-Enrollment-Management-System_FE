import {
  Button,
  Card,
  Col,
  Collapse,
  Form,
  Input,
  Layout,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd'

import './AdmissionPage.css'

const { Header, Content, Footer } = Layout
const { Title, Paragraph, Text } = Typography
const { Panel } = Collapse
const { Option } = Select

export function AdmissionPage() {
  return (
    <Layout className="admission-page">
      <Header className="admission-header">
        <div className="admission-header-inner">
          <div className="admission-logo">FPTU</div>
          <Space size="large" className="admission-nav">
            <Text strong>Về FPTU</Text>
            <Text strong>Đào tạo</Text>
            <Text strong>Tuyển sinh</Text>
            <Text strong>Đời sống sinh viên</Text>
          </Space>
          <Button type="primary" className="admission-header-cta">
            Đăng ký tuyển sinh
          </Button>
        </div>
      </Header>

      <Content className="admission-content">
        <section className="admission-hero">
          <Row gutter={[48, 32]} align="middle">
            <Col xs={24} md={14}>
              <Tag color="orange" className="admission-hero-tag">
                Tuyển sinh 2026
              </Tag>
              <Title level={1} className="admission-hero-title">
                Tuyển sinh
              </Title>
              <Paragraph className="admission-hero-subtitle">
                Trường Đại học FPT chào đón thế hệ sinh viên đại học chính quy năm 2026 –
                những người không chỉ theo đuổi tri thức, mà còn khát khao tạo ra giá trị
                mới trong kỷ nguyên số đang không ngừng chuyển động.
              </Paragraph>
              <Paragraph>
                Chương trình đào tạo đa ngành được xây dựng trên nền tảng công nghệ, tinh thần
                dám nghĩ dám làm và tư duy hội nhập, giúp sinh viên sẵn sàng bước vào môi
                trường sự nghiệp toàn cầu.
              </Paragraph>
              <Space size="middle" className="admission-hero-actions">
                <Button type="primary" size="large">
                  Đăng ký ngay
                </Button>
                <Button size="large">Tìm hiểu học bổng</Button>
              </Space>
            </Col>
            <Col xs={24} md={10}>
              <Card className="admission-highlight-card" bordered={false}>
                <Title level={4}>Dự kiến phương thức tuyển sinh 2026</Title>
                <Paragraph>
                  Kết hợp đa tiêu chí để đánh giá toàn diện năng lực, mở rộng cơ hội vào môi
                  trường đào tạo gắn với thực tiễn doanh nghiệp.
                </Paragraph>
                <Space direction="vertical" size="small">
                  <Text>- Phương thức 1: Xét tuyển thẳng</Text>
                  <Text>- Phương thức 2: Xét tuyển kết hợp</Text>
                  <Text>- Phương thức 3: Ưu tiên xét tuyển</Text>
                </Space>
              </Card>
            </Col>
          </Row>
        </section>

        <section className="admission-section">
          <Title level={2}>Dự kiến phương thức tuyển sinh 2026</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card className="admission-card" title="Phương thức 1" bordered={false}>
                <Title level={4}>Xét tuyển thẳng</Title>
                <Paragraph>
                  Áp dụng cho thí sinh thuộc diện xét tuyển thẳng theo quy định hiện hành
                  của Bộ Giáo dục và Đào tạo.
                </Paragraph>
                <Paragraph type="secondary">
                  Các thí sinh đăng ký học ngành Luật phải đảm bảo điều kiện theo Quyết định
                  số 678/QĐ-BGDĐT ngày 14/03/2025 về Chuẩn chương trình đào tạo lĩnh vực
                  pháp luật trình độ đại học.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="admission-card" title="Phương thức 2" bordered={false}>
                <Title level={4}>Xét tuyển kết hợp</Title>
                <Paragraph>
                  Xét tuyển dựa trên kết quả kỳ thi tốt nghiệp THPT kết hợp với kết quả học
                  tập THPT, cùng với điểm ưu tiên theo quy định.
                </Paragraph>
                <Paragraph>
                  <Text strong>Điểm xét tuyển</Text> được xác định như sau:
                </Paragraph>
                <Paragraph className="admission-formula">
                  Điểm xét tuyển = (Điểm thi THPT + ĐTB các năm học) / 2 + Điểm ưu tiên
                </Paragraph>
                <Paragraph type="secondary">
                  Điểm xét tuyển làm tròn đến 2 số lẻ.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="admission-card" title="Phương thức 3" bordered={false}>
                <Title level={4}>Ưu tiên xét tuyển</Title>
                <Paragraph>
                  Áp dụng đối với nhóm thí sinh có nền tảng học tập hoặc quá trình đào tạo
                  phù hợp như:
                </Paragraph>
                <ul className="admission-list">
                  <li>Thí sinh tốt nghiệp THPT nước ngoài, hoặc các trường thuộc FPT.</li>
                  <li>
                    Thí sinh có chứng chỉ/văn bằng: APTECH, ARENA, SKILLKING, JETKING, BTEC
                    HND, Melbourne Polytechnic, FUNiX SE, Cao đẳng FPT Polytechnic.
                  </li>
                </ul>
              </Card>
            </Col>
          </Row>
        </section>

        <section className="admission-section">
          <Row gutter={[24, 24]} align="stretch">
            <Col xs={24} md={14}>
              <Card className="admission-card" bordered={false}>
                <Title level={2}>Học bổng FPTU 2026</Title>
                <Title level={4}>Chương trình Tìm kiếm Nhân tài Kỷ nguyên số Việt Nam</Title>
                <Paragraph>
                  Học bổng Nguyễn Văn Đạo nhằm phát hiện và hỗ trợ học sinh có thành tích,
                  năng lực và phẩm chất nổi bật trên toàn quốc trong các lĩnh vực học thuật,
                  công nghệ, đổi mới sáng tạo, lãnh đạo và bản lĩnh vượt khó.
                </Paragraph>
                <Paragraph>
                  Quỹ học bổng lên tới hơn <Text strong>200 tỷ đồng</Text> với 6 nhóm học
                  bổng chuyên biệt, giá trị từ <Text strong>50% – 100% học phí toàn khóa</Text>{' '}
                  cùng nhiều quyền lợi đặc biệt.
                </Paragraph>
                <Button type="link" className="admission-link-button">
                  Xem chi tiết chương trình học bổng
                </Button>
              </Card>
            </Col>
            <Col xs={24} md={10}>
              <Card className="admission-card tuition-card" bordered={false}>
                <Title level={3}>Học phí</Title>
                <Paragraph>
                  Kế hoạch đóng học phí cho sinh viên nhập học năm 2026 được cố định trong
                  suốt quá trình học, đã bao gồm giáo trình, học liệu và trang thiết bị.
                </Paragraph>
                <Space direction="vertical">
                  <Tag color="orange">Hà Nội</Tag>
                  <Tag color="orange">TP. Hồ Chí Minh</Tag>
                  <Tag color="orange">Đà Nẵng</Tag>
                  <Tag color="orange">Cần Thơ</Tag>
                  <Tag color="orange">Quy Nhơn</Tag>
                </Space>
                <Button type="link" className="admission-link-button">
                  Xem chi tiết học phí theo campus
                </Button>
              </Card>
            </Col>
          </Row>
        </section>

        <section className="admission-section">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card className="admission-card" bordered={false}>
                <Title level={2}>Chính sách ưu đãi tài chính 2026</Title>
                <Paragraph>
                  FPTU tin rằng cơ hội học tập chất lượng quốc tế phải dành cho mọi sinh
                  viên, bất kể hoàn cảnh kinh tế.
                </Paragraph>
                <ul className="admission-list">
                  <li>
                    Ưu đãi <Text strong>30% học phí</Text> cho tất cả thí sinh thuộc{' '}
                    <Text strong>Khu vực 1</Text>.
                  </li>
                  <li>
                    Ưu đãi <Text strong>30% học phí toàn khóa</Text> cho sinh viên học tại{' '}
                    <Text strong>Cần Thơ</Text> và <Text strong>Đà Nẵng</Text>.
                  </li>
                  <li>
                    Ưu đãi <Text strong>50% học phí toàn khóa</Text> cho sinh viên học tại{' '}
                    <Text strong>Quy Nhơn</Text>.
                  </li>
                </ul>
                <Button type="link" className="admission-link-button">
                  Xem chi tiết chính sách tài chính
                </Button>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className="admission-card" bordered={false}>
                <Title level={3}>Lịch Open Day tại 5 campus</Title>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Card size="small" className="admission-open-day-card">
                      <Text strong>Big Open Day</Text>
                      <Paragraph>18/01/2026 – 5 Campus Trường Đại học FPT</Paragraph>
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card size="small" className="admission-open-day-card">
                      <Text strong>FPTU Open Day Đà Nẵng</Text>
                      <Paragraph>21/12/2025 – Campus Đà Nẵng</Paragraph>
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card size="small" className="admission-open-day-card">
                      <Text strong>FPTU Open Day Hà Nội</Text>
                      <Paragraph>21/12/2025 – Campus Hà Nội</Paragraph>
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card size="small" className="admission-open-day-card">
                      <Text strong>FPTU Open Day Quy Nhơn</Text>
                      <Paragraph>20 - 21/12/2025 – Campus Quy Nhơn</Paragraph>
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card size="small" className="admission-open-day-card">
                      <Text strong>FPTU Open Day Cần Thơ</Text>
                      <Paragraph>30/11/2025 – Campus Cần Thơ</Paragraph>
                    </Card>
                  </Col>
                </Row>
                <Button type="primary" className="admission-open-day-cta">
                  Đăng ký tham gia Open Day
                </Button>
              </Card>
            </Col>
          </Row>
        </section>

        <section className="admission-section">
          <Row gutter={[32, 32]} align="stretch">
            <Col xs={24} md={14}>
              <Title level={2}>Đăng ký tuyển sinh vào FPTU 2026</Title>
              <Card className="admission-card" bordered={false}>
                <Form layout="vertical">
                  <Form.Item
                    label="Họ và tên"
                    name="fullName"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                  >
                    <Input placeholder="Nguyễn Văn A" />
                  </Form.Item>
                  <Form.Item
                    label="Tỉnh thành"
                    name="province"
                    rules={[{ required: true, message: 'Vui lòng chọn tỉnh thành' }]}
                  >
                    <Select placeholder="Chọn tỉnh thành">
                      <Option value="ha-noi">Hà Nội</Option>
                      <Option value="tp-hcm">TP. Hồ Chí Minh</Option>
                      <Option value="da-nang">Đà Nẵng</Option>
                      <Option value="can-tho">Cần Thơ</Option>
                      <Option value="quy-nhon">Quy Nhơn</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                  >
                    <Input placeholder="Số điện thoại liên hệ" />
                  </Form.Item>
                  <Form.Item label="Trường" name="school">
                    <Input placeholder="Tên trường THPT" />
                  </Form.Item>
                  <Form.Item label="Chuyên ngành lựa chọn" name="major">
                    <Select placeholder="Chọn chuyên ngành">
                      <Option value="cntt">Công nghệ thông tin</Option>
                      <Option value="ai">Trí tuệ nhân tạo</Option>
                      <Option value="marketing">Marketing</Option>
                      <Option value="ngon-ngu-anh">Ngôn ngữ Anh</Option>
                      <Option value="quan-tri-kinh-doanh">Quản trị kinh doanh</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Email" name="email">
                    <Input placeholder="example@domain.com" />
                  </Form.Item>
                  <Form.Item name="agree" valuePropName="checked">
                    <span className="admission-consent-text">
                      Bằng việc gửi form này, bạn đồng ý để dữ liệu cá nhân được thu thập và
                      xử lý bởi Trường Đại học FPT theo Quy định bảo vệ dữ liệu cá nhân của
                      Tổ chức giáo dục FPT.
                    </span>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" size="large" htmlType="submit" block>
                      Đăng ký ngay – Bắt đầu hành trình của bạn
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            <Col xs={24} md={10}>
              <Title level={3}>FAQ</Title>
              <Collapse accordion className="admission-faq">
                <Panel header="Trường Đại học FPT có đào tạo ngành học nào?" key="1">
                  <Paragraph>
                    FPTU đào tạo 38 chuyên ngành thuộc các khối: Công nghệ thông tin, Quản trị
                    kinh doanh, Công nghệ truyền thông, Luật, Cử nhân tài năng và Khối ngành
                    Ngôn ngữ.
                  </Paragraph>
                </Panel>
                <Panel header="Trường Đại học FPT có những phương thức tuyển sinh nào?" key="2">
                  <Paragraph>
                    Năm 2026, FPTU dự kiến tuyển sinh với 03 phương thức: xét tuyển thẳng, xét
                    tuyển kết hợp và ưu tiên xét tuyển, kết hợp đa tiêu chí để đánh giá toàn
                    diện năng lực.
                  </Paragraph>
                </Panel>
                <Panel header="Học phí Trường Đại học FPT là bao nhiêu?" key="3">
                  <Paragraph>
                    Học phí được công bố theo từng campus (Hà Nội, TP.HCM, Đà Nẵng, Cần Thơ,
                    Quy Nhơn) và không thay đổi trong suốt khóa học. Chi tiết xem tại mục học
                    phí theo campus.
                  </Paragraph>
                </Panel>
                <Panel header="Trường có ký túc xá không?" key="4">
                  <Paragraph>
                    FPTU có ký túc xá tại các campus Hà Nội, Đà Nẵng, Cần Thơ và Quy Nhơn, nằm
                    ngay trong khuôn viên trường.
                  </Paragraph>
                </Panel>
                <Panel header="Cơ hội việc làm sau khi tốt nghiệp như thế nào?" key="5">
                  <Paragraph>
                    Sinh viên FPTU có cơ hội thực tập và làm việc tại các doanh nghiệp trong
                    và ngoài nước, với mạng lưới đối tác rộng khắp và định hướng đào tạo gắn
                    với thực tiễn.
                  </Paragraph>
                </Panel>
              </Collapse>
            </Col>
          </Row>
        </section>
      </Content>

      <Footer className="admission-footer">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Title level={4}>Giới thiệu chung</Title>
            <Space direction="vertical">
              <Text>Về FPTU</Text>
              <Text>Cơ sở vật chất & campus</Text>
              <Text>Đối tác & hợp tác quốc tế</Text>
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Title level={4}>Truy cập nhanh</Title>
            <Space direction="vertical">
              <Text>Thông tin tuyển sinh năm 2026</Text>
              <Text>Open days</Text>
              <Text>Học phí</Text>
              <Text>Học bổng</Text>
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Title level={4}>Liên hệ</Title>
            <Space direction="vertical">
              <Text>Hà Nội: Khu GD&ĐT – Khu CNC Hòa Lạc, Km29 Đại lộ Thăng Long</Text>
              <Text>TP.HCM: Lô E2a-7, Đường D1, Khu CNC, TP. Hồ Chí Minh</Text>
              <Text>Đà Nẵng, Cần Thơ, Quy Nhơn: Xem chi tiết trên website</Text>
            </Space>
          </Col>
        </Row>
        <div className="admission-footer-bottom">
          <Text>© 2026 Trường Đại học FPT.</Text>
        </div>
      </Footer>
    </Layout>
  )
}

