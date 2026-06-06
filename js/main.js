document.addEventListener("DOMContentLoaded", () => {
    const saveBtn = document.getElementById("saveEmployeeBtn");
    const tableBody = document.querySelector("table tbody");

    // 1. تعريف المصفوفة الافتراضية للموظفين المتواجدين بالصفحة أصلاً لضمان عدم ضياعهم
    const defaultEmployees = [
        { id: "1", name: "Mohamed Almetwaly", email: "Almetwaly088@gmail.com", dept: "تكنولوجيا المعلومات", role: "Frontend Developer", date: "اليوم", status: "نشط" },
        { id: "2", name: "أحمد علي", email: "ahmed@company.com", dept: "تكنولوجيا المعلومات", role: "Senior Web Developer", date: "12 يناير 2024", status: "نشط" },
        { id: "3", name: "سارة محمد", email: "sara@company.com", dept: "الموارد البشرية", role: "HR Specialist", date: "05 مارس 2023", status: "في إجازة" },
        { id: "4", name: "محمود حسن", email: "mahmoud@company.com", dept: "الحسابات والمبيعات", role: "Accountant", date: "18 نوفمبر 2022", status: "غير نشط" }
    ];

    // جلب البيانات المخزنة أو اعتماد القائمة الافتراضية إذا كانت فارغة
    let currentEmployees = [];
    try {
        const stored = localStorage.getItem("employees");
        if (stored) {
            currentEmployees = JSON.parse(stored);
        } else {
            currentEmployees = defaultEmployees;
            localStorage.setItem("employees", JSON.stringify(defaultEmployees));
        }
    } catch (e) {
        currentEmployees = defaultEmployees;
        console.log("بروتوكول الأمان لـ file:// يمنع التخزين المتصفحي، تم التحويل للمصفوفة الحية.");
    }

    // دالة لبناء الجدول وعرض الموظفين
    function renderEmployeesTable() {
        if (!tableBody) return;
        tableBody.innerHTML = ""; // مسح الجدول لإعادة بنائه نقياً

        currentEmployees.forEach(emp => {
            const initials = emp.name.split(" ").map(word => word[0]).slice(0, 2).join("");
            
            let badgeClass = "bg-success bg-opacity-10 text-success";
            if (emp.status === "في إجازة") badgeClass = "bg-warning bg-opacity-10 text-warning";
            if (emp.status === "غير نشط") badgeClass = "bg-danger bg-opacity-10 text-danger";

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>
                    <div class="d-flex align-items-center justify-content-start gap-3 px-3">
                        <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 38px; height: 38px; font-weight: bold;">
                            ${initials || 'مو'}
                        </div>
                        <div class="text-start">
                            <h6 class="mb-0 fw-bold">${emp.name}</h6>
                            <small class="text-muted">${emp.email}</small>
                        </div>
                    </div>
                </td>
                <td>${emp.dept}</td>
                <td>${emp.role}</td>
                <td>${emp.date}</td>
                <td><span class="badge ${badgeClass} rounded-pill px-3 py-2">${emp.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-secondary me-1 edit-btn" data-id="${emp.id}" title="تعديل"><i class="bi bi-pencil-square"></i></button>
                    <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${emp.id}" title="حذف"><i class="bi bi-trash"></i></button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // عرض الجدول عند فتح الصفحة لأول مرة
    renderEmployeesTable();

    // 2. معالج حدث الضغط على زر الحفظ (إضافة موظف جديد)
    if (saveBtn) {
        saveBtn.addEventListener("click", () => {
            const name = document.getElementById("empName").value.trim();
            const email = document.getElementById("empEmail").value.trim();
            const dept = document.getElementById("empDept").value;
            const role = document.getElementById("empRole").value.trim();

            if (!name || !email || !dept || !role) {
                alert("يرجى ملء جميع الحقول أولاً واختيار القسم المناسب!");
                return;
            }

            // إنشاء كائن الموظف الجديد
            const newEmployee = {
                id: String(Date.now()), // معرف فريد
                name: name,
                email: email,
                dept: dept,
                role: role,
                date: "اليوم",
                status: "نشط"
            };

            // إضافة الموظف في أول المصفوفة
            currentEmployees.unshift(newEmployee);

            // حفظ التحديثات في الـ LocalStorage ليظهر في صفحة الرواتب فوراً
            try {
                localStorage.setItem("employees", JSON.stringify(currentEmployees));
            } catch (e) {}

            // إعادة تحديث عرض الجدول
            renderEmployeesTable();

            // تصفير المودال أو الفورم وإغلاقه
            const addForm = document.getElementById("addEmployeeForm");
            if (addForm) addForm.reset();

            // كود اختياري لإغلاق الـ Modal الخاص ببوتستراب تلقائياً بعد الحفظ
            const modalEl = document.getElementById('addEmployeeModal'); // تأكد من الـ ID الخاص بالمودال لديك
            if (modalEl) {
                const modalInstance = bootstrap.Modal.getInstance(modalEl);
                if (modalInstance) modalInstance.hide();
            }

            console.log("تمت إضافة الموظف ومزامنته للرواتب بنجاح!");
        });
    }

    // 3. معالجة تفعيل زر الحذف المباشر من الجدول
    if (tableBody) {
        tableBody.addEventListener("click", (e) => {
            const deleteBtn = e.target.closest(".delete-btn");
            if (deleteBtn) {
                const empId = deleteBtn.getAttribute("data-id");
                if (confirm("هل أنت متأكد من حذف هذا الموظف؟")) {
                    currentEmployees = currentEmployees.filter(emp => emp.id !== empId);
                    try {
                        localStorage.setItem("employees", JSON.stringify(currentEmployees));
                    } catch (e) {}
                    renderEmployeesTable();
                }
            }
        });
    }
});
document.addEventListener("DOMContentLoaded", () => {
    // جلب الإعدادات من الـ LocalStorage
    const savedSettings = JSON.parse(localStorage.getItem("hr_dashboard_settings"));
    
    if (savedSettings && savedSettings.adminName) {
        // 1. تحديث الحروف الأولى لاسم الآدمن في الدائرة العلوية (Navbar)
        const nameParts = savedSettings.adminName.trim().split(" ");
        const initials = nameParts.map(p => p[0]).slice(0, 2).join("");
        
        const navAvatar = document.getElementById("navAdminInitials");
        if (navAvatar) {
            navAvatar.textContent = initials.toUpperCase();
        }

        // 2. تحديث اسم الشركة في الـ Sidebar لو عندك تاغ مخصص ليها
        const companyTitle = document.querySelector(".sidebar h4");
        if (companyTitle && savedSettings.companyName) {
            companyTitle.innerHTML = `<i class="bi bi-person-workspace me-2"></i>${savedSettings.companyName}`;
        }
    }
});
// js/main.js

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. جلب الإعدادات من الـ LocalStorage أو وضع قيم افتراضية لو مش موجودة
    const globalSettings = JSON.parse(localStorage.getItem("hr_dashboard_settings")) || {
        adminName: "محمد المتولي",
        adminEmail: "Almetwaly088@gmail.com",
        companyName: "شركة المتولي للبرمجيات",
        currency: "ج.م"
    };

    // 2. تحديث اسم الشركة في الـ Sidebar (إذا كان العنصر موجوداً بالصفحة)
    const sidebarComp = document.getElementById("sidebarCompanyName");
    if (sidebarComp && globalSettings.companyName) {
        sidebarComp.innerHTML = `<i class="bi bi-person-workspace me-2"></i>${globalSettings.companyName}`;
    }

    // 3. تحديث رسالة الترحيب الخاصة بالأدمن (لو موجودة في الصفحة الرئيسية مثلاً)
    const welcomeMsg = document.getElementById("welcomeAdminMessage");
    if (welcomeMsg && globalSettings.adminName) {
        welcomeMsg.textContent = `أهلاً بك مجدداً، ${globalSettings.adminName} 👋`;
    }

    // 4. تحديث الاسم داخل القائمة المنسدلة للبروفايل في الـ Navbar
    const dropdownAdminName = document.getElementById("dropdownAdminName");
    if (dropdownAdminName && globalSettings.adminName) {
        dropdownAdminName.textContent = globalSettings.adminName;
    }

    // 5. توليد الحروف الأولى للاسم وتحديث الأفاتار الدائري (مو)
    const navAvatar = document.getElementById("navAdminInitials");
    if (navAvatar && globalSettings.adminName) {
        const nameParts = globalSettings.adminName.trim().split(" ");
        // بيأخذ أول حرف من أول اسم وثاني اسم
        const initials = nameParts.map(p => p[0]).slice(0, 2).join("");
        navAvatar.textContent = initials.toUpperCase();
    }

    // 6. تحديث رموز العملة في أي مكان بالصفحة يحمل الكلاس (.currency-label)
    document.querySelectorAll(".currency-label").forEach(el => {
        el.textContent = globalSettings.currency || "ج.م";
    });

});