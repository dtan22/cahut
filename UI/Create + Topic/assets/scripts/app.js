var navLinks = document.querySelectorAll('nav a');

  // Lặp qua từng liên kết và thêm sự kiện "click"
  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      // Xóa lớp "active" khỏi tất cả các liên kết
      navLinks.forEach(function(link) {
        link.classList.remove('active');
      });

      // Thêm lớp "active" cho liên kết hiện tại
      this.classList.add('active');
    });
  });