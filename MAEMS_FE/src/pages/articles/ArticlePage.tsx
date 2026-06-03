import { Breadcrumb, Card, Pagination, Spin, Typography } from "antd";
import { CalendarDays, Newspaper } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CampusHeroBackground } from "../../components/CampusHeroBackground";
import {
  PublicHeroReveal,
  PublicItemReveal,
  PublicSectionReveal,
} from "@/components/public/PublicPageMotion";
import { getPublishedArticlesBasic } from "../../api/articles";
import type { ArticleBasic } from "../../types/article";

const { Title, Paragraph } = Typography;

function formatVnDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function ArticlePage() {
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<ArticleBasic[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  /* pageSize do người dùng chọn qua Pagination */
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      try {
        const { items, totalCount: total } = await getPublishedArticlesBasic({
          pageNumber,
          pageSize,
          sortBy: "updatedAt",
          sortDesc: true,
        });
        if (!cancelled) {
          setArticles(items);
          setTotalCount(total);
        }
      } catch {
        if (!cancelled) {
          setArticles([]);
          setTotalCount(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [pageNumber, pageSize]);

  return (
    <>
      {/* Hero ảnh khuôn viên — đồng bộ visual với home và /dao-tao */}
      <section className="relative min-h-[min(52vh,420px)] flex items-end overflow-hidden px-4 md:px-6 pb-10 pt-28">
        <CampusHeroBackground />
        <div className="relative z-10 max-w-4xl mx-auto w-full">
          <PublicHeroReveal delay={0}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
              <Newspaper size={14} className="text-orange-300" />
              <Typography.Text className="!text-orange-200 text-sm font-medium">
                Cập nhật từ Trường Đại học FPT
              </Typography.Text>
            </div>
          </PublicHeroReveal>
          <PublicHeroReveal delay={0.12}>
            <Title
              level={1}
              className="!text-white !text-3xl md:!text-5xl !font-extrabold !mb-2"
            >
              Tin tức
            </Title>
          </PublicHeroReveal>
          <PublicHeroReveal delay={0.22}>
            <Typography.Paragraph className="!text-gray-200 !mb-0 max-w-xl">
              Thông báo, sự kiện và hoạt động mới nhất của nhà trường.
            </Typography.Paragraph>
          </PublicHeroReveal>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 -mt-2 relative z-10">
        <PublicSectionReveal delay={0.04}>
          <Breadcrumb
            className="mb-6 text-sm"
            items={[
              { title: <Link to="/">Trang chủ</Link> },
              { title: "Tin tức" },
            ]}
          />
        </PublicSectionReveal>

        <PublicSectionReveal delay={0.08}>
        <div className="flex flex-col gap-6 rounded-2xl bg-white/95 backdrop-blur-sm border border-gray-100 shadow-sm p-4 sm:p-6 md:p-8">
          {/* Danh sách bài viết + trạng thái loading/empty */}
          {loading ? (
            <div className="py-20 flex items-center justify-center">
              <Spin />
            </div>
          ) : articles.length === 0 ? (
            <div className="min-h-[240px] flex items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/80">
              <Typography.Text type="secondary">
                Chưa có bài viết nào.
              </Typography.Text>
            </div>
          ) : (
            articles.map((article, i) => (
              <PublicItemReveal key={article.articleId} index={i}>
              <Link
                to={`/tin-tuc/${article.articleId}`}
                className="group block"
              >
                <Card
                  hoverable
                  className="!rounded-xl !border-gray-100 !shadow-sm overflow-hidden"
                  bodyStyle={{ padding: 0 }}
                >
                  <div className="flex flex-col sm:flex-row gap-0">
                    {/* Container ảnh: cố định 192px (h-48) trên mọi breakpoint để thumbnail không bị kéo dài */}
                    <div className="sm:w-64 sm:shrink-0 h-48 sm:h-48 sm:max-h-48 overflow-hidden">
                      <img
                        src={article.thumbnail}
                        alt={article.title}
                        className="w-full h-full max-w-full max-h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5 flex flex-col justify-center gap-2">
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <CalendarDays size={13} className="text-orange-500" />
                        <span>{formatVnDate(article.updatedAt)}</span>
                      </div>
                      <Title
                        level={4}
                        className="!font-bold !text-gray-900 !mb-0 group-hover:!text-orange-500 !transition-colors"
                      >
                        {article.title}
                      </Title>
                      <Paragraph className="!text-gray-500 !text-sm !mb-0 !line-clamp-2">
                        Xem thêm nội dung chi tiết trong bài viết.
                      </Paragraph>
                    </div>
                  </div>
                </Card>
              </Link>
              </PublicItemReveal>
            ))
          )}

          {/* Pagination — chỉ hiển thị khi có dữ liệu */}
          {!loading && totalCount > 0 && (
            <div className="flex justify-center pt-2">
              <Pagination
                current={pageNumber}
                pageSize={pageSize}
                total={totalCount}
                showSizeChanger
                pageSizeOptions={[5, 10, 20, 50]}
                showTotal={(total, range) =>
                  `${range[0]}–${range[1]} / ${total} bài viết`
                }
                onChange={(page, size) => {
                  // Reset về trang 1 khi người dùng đổi số item mỗi trang
                  if (size !== pageSize) {
                    setPageSize(size);
                    setPageNumber(1);
                  } else {
                    setPageNumber(page);
                  }
                }}
                className="select-none"
              />
            </div>
          )}
        </div>
        </PublicSectionReveal>
      </div>
    </>
  );
}
