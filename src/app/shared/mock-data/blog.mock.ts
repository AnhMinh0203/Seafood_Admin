import { BlogDto } from '../models/blog.model';

export const BLOG_FAKE_DATA: BlogDto[] = [
  {
    id: 1,
    title: 'Top 5 loại hải sản tươi ngon nên thử trong tuần này',
    coverImage: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=1200',
    summary: "abc",
    content: `
      Hải sản luôn là lựa chọn hàng đầu cho những bữa ăn vừa ngon vừa giàu dinh dưỡng.
      Trong bài viết này, chúng tôi sẽ giới thiệu 5 loại hải sản được yêu thích nhất hiện nay
      và cách chế biến phù hợp để giữ được độ tươi ngon tự nhiên.

      Bạn có thể thử các món như tôm hấp, cua rang me, mực nướng sa tế, sò hấp sả
      và cá hồi áp chảo. Mỗi loại đều có hương vị riêng, phù hợp cho bữa cơm gia đình
      hoặc các buổi tụ họp cuối tuần.
    `,
    view: 128,
    creationTime: '2026-04-02T08:00:00',
    creatorId: '11111111-1111-1111-1111-111111111111',
    creatorName: 'Admin'
  },
  {
    id: 2,
    title: 'Cách chọn cua biển chắc thịt, nhiều gạch cho người mới',
    coverImage: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=1200',
    summary: "abc",
    content: `
      Việc chọn cua ngon không khó nếu bạn nắm được một vài mẹo nhỏ như quan sát yếm cua,
      màu sắc mai và cảm giác khi cầm. Những con cua chắc tay, di chuyển khỏe và có mai sáng
      thường sẽ cho chất lượng thịt tốt hơn.

      Ngoài ra, bạn cũng nên phân biệt cua đực và cua cái tùy theo nhu cầu:
      cua cái thường nhiều gạch, cua đực thường chắc thịt hơn.
    `,
    view: 245,
    creationTime: '2026-04-01T10:30:00',
    creatorId: '22222222-2222-2222-2222-222222222222',
    creatorName: 'SeaFood Team'
  },
  {
    id: 3,
    title: 'Tôm hấp hay tôm nướng: món nào giữ được vị ngọt tự nhiên hơn?',
    coverImage: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=1200',
    summary: "abc",
    content: `
      Tôm là nguyên liệu rất dễ chế biến, tuy nhiên mỗi phương pháp nấu sẽ mang đến hương vị khác nhau.
      Tôm hấp giữ được độ ngọt tự nhiên, trong khi tôm nướng mang mùi thơm đậm đà và hấp dẫn hơn.

      Nếu bạn thích cảm nhận vị nguyên bản của hải sản, tôm hấp là lựa chọn tốt.
      Nếu muốn món ăn đậm vị và có cảm giác “bùng vị” hơn, hãy thử tôm nướng.
    `,
    view: 189,
    creationTime: '2026-03-30T14:15:00',
    creatorId: null,
    creatorName: 'Chef Hải'
  },
  {
    id: 4,
    title: '3 công thức sốt chấm hải sản cực cuốn tại nhà',
    coverImage: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=1200',
    summary: "abc",
    content: `
      Một món hải sản ngon sẽ càng trọn vị hơn nếu đi kèm loại sốt chấm phù hợp.
      Bạn có thể thử sốt muối tiêu chanh, sốt xanh kiểu Thái hoặc sốt đỏ cay ngọt.

      Chỉ cần một vài nguyên liệu cơ bản như muối, tiêu, chanh, ớt, sữa đặc hoặc lá chanh
      là bạn đã có thể tạo nên một bát chấm rất bắt vị ngay tại nhà.
    `,
    view: 321,
    creationTime: '2026-03-28T09:20:00',
    creatorId: '33333333-3333-3333-3333-333333333333',
    creatorName: 'Minh'
  }
];