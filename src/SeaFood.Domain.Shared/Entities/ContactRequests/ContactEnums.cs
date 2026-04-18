using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Entities.ContactRequests
{
    public enum ContactProductType
    {
        ComboGaRan = 1,
        BurgerBo = 2,
        PizzaHaiSan = 3,
        MiYSotKem = 4,
        CaHoiNuong = 5,
        Khac = 6
    }

    public enum ContactInquiryType
    {
        TuVanSanPham = 1,
        DatHangSoLuongLon = 2,
        HopTacDaiLy = 3,
        KhieuNaiHoTro = 4,
        GopYDichVu = 5
    }

    public enum ContactRequestStatus
    {
        Pending = 0,
        Processed = 1
    }
}
