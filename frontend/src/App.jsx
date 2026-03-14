import { useState, useEffect } from "react";

function App() {
  const [sinhViens, setSinhViens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const API_URL = "/api/sinhvien";

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Không thể kết nối (Có thể do lỗi CORS)");
        }
        return res.json();
      })
      .then((data) => {
        setSinhViens(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Chi tiết lỗi:", err);
        setErrorMsg(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Danh Sách Sinh Viên</h2>

      {loading ? (
        <div className="text-center text-primary">
          Đang tải dữ liệu từ Backend...
        </div>
      ) : errorMsg ? (
        <div className="alert alert-danger text-center">
          <strong>Lỗi:</strong> {errorMsg} <br />
          (Vui lòng bấm F12, mở tab Console để xem chi tiết lỗi đỏ)
        </div>
      ) : (
        <table className="table table-bordered table-striped table-hover shadow-sm">
          <thead className="table-dark">
            <tr>
              <th className="text-center">ID</th>
              <th>Mã Sinh Viên</th>
              <th>Họ Tên</th>
              <th>Lớp</th>
              <th>Ngày Tạo</th>
            </tr>
          </thead>
          <tbody>
            {sinhViens.map((sv) => (
              <tr key={sv.id}>
                <td className="text-center">{sv.id}</td>
                <td>{sv.maSinhVien}</td>
                <td className="fw-bold">{sv.hoTen}</td>
                <td>{sv.lop}</td>
                <td>{new Date(sv.ngayTao).toLocaleString("vi-VN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {sinhViens.length === 0 && !loading && !errorMsg && (
        <div className="alert alert-warning text-center">
          Không có dữ liệu sinh viên nào trong Database.
        </div>
      )}
    </div>
  );
}

export default App;
