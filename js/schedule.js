// Система управления расписанием W Garage на основе таблицы июль 2025

// Вспомогательная функция для создания расписания из строки дней
function parseScheduleString(scheduleStr) {
    const schedule = {};
    for (let day = 1; day <= 31; day++) {
        if (day <= scheduleStr.length) {
            const dayValue = scheduleStr[day - 1];
            schedule[day] = dayValue === '1' ? 'work' : 'weekend';
        } else {
            schedule[day] = 'weekend';
        }
    }
    return schedule;
}

// Конструктор ScheduleManager
function ScheduleManager() {
    this.scheduleData = {
        month: 'Июль',
        year: 2025,
        employees: {
            // Руководство
            'admin': {
                name: 'Лавдимва В.И.',
                position: 'Директор',
                department: 'Руководство',
                workDays: 23,
                schedule: parseScheduleString('1111001111001111001111001111')
            },
            'marilyn.fd': {
                name: 'Мариян А.Д.',
                position: 'Зам директора',
                department: 'Руководство', 
                workDays: 23,
                schedule: parseScheduleString('1111001111001111001111001111')
            },
            'tochenko.dv': {
                name: 'Точенко Д.В.',
                position: 'Финансовый директор',
                department: 'Руководство',
                workDays: 25,
                schedule: parseScheduleString('11110011111001111001111001111')
            },
            
            // Менеджеры
            'maxlashevskyi.so': {
                name: 'Маклашевський С.О.',
                position: 'Коммерческий директор',
                department: 'Менеджмент',
                workDays: 25,
                schedule: parseScheduleString('11110011111001111001111001111')
            },
            'ruslan.di': {
                name: 'Руслан Д.І.',
                position: 'Менеджер',
                department: 'Менеджмент',
                workDays: 25,
                schedule: parseScheduleString('11110011111001111001111001111')
            },
            
            // Приемщик
            'lyd.tuzenko': {
                name: 'Туженко Д.С.',
                position: 'Приемщик',
                department: 'Приемная',
                workDays: 27,
                schedule: parseScheduleString('111110111110111110111110111')
            },
            'puchkov.ia': {
                name: 'Пучков І.А.',
                position: 'Приемщик',
                department: 'Приемная', 
                workDays: 27,
                schedule: parseScheduleString('111110111110111110111110111')
            },
            'galiant.vv': {
                name: 'Галянт В.В.',
                position: 'Приемщик',
                department: 'Приемная',
                workDays: 23,
                schedule: parseScheduleString('1111001111001111001111001111')
            },
            'martyshov.e': {
                name: 'Мартышов Е., завг',
                position: 'Заведующий складом',
                department: 'Приемная',
                workDays: 27,
                schedule: parseScheduleString('111110111110111110111110111')
            },
            'varusschenko.na': {
                name: 'Варущенко Н.А.',
                position: 'Менеджер',
                department: 'Менеджмент',
                workDays: 27,
                schedule: parseScheduleString('111110111110111110111110111')
            },
            'yakovlev.oi': {
                name: 'Яковлев О.И. склад',
                position: 'Кладовщик',
                department: 'Офис',
                workDays: 14,
                schedule: parseScheduleString('000000000000000011111011111')
            },
            
            // Офисные работники
            'smyk.sr': {
                name: 'Смык С.Р кассир',
                position: 'Кассир',
                department: 'Офис',
                workDays: 26,
                schedule: parseScheduleString('111110111110111110111110111')
            },
            'talanov.sm': {
                name: 'Таланов С.М.',
                position: 'Офис-менеджер',
                department: 'Офис',
                workDays: 23,
                schedule: parseScheduleString('1111001111001111001111001111')
            },
            'marchuk.ma': {
                name: 'Марчук М.А. склад',
                position: 'Кладовщик',
                department: 'Офис',
                workDays: 27,
                schedule: parseScheduleString('111110111110111110111110111')
            },
            'nazarov.v': {
                name: 'Назаров В.',
                position: 'Менеджер',
                department: 'Офис',
                workDays: 23,
                schedule: parseScheduleString('1111001111001111001111001111')
            },
            'shulgan.so': {
                name: 'Шулган С.О.',
                position: 'Офис-менеджер',
                department: 'Офис',
                workDays: 23,
                schedule: parseScheduleString('1111001111001111001111001111')
            },
            'procenko.ss': {
                name: 'Проценко С.С.',
                position: 'Менеджер',
                department: 'Офис',
                workDays: 25,
                schedule: parseScheduleString('11110011111001111001111001111')
            },
            
            // Топливщики
            'shelest.aa': {
                name: 'Шелест А.А.',
                position: 'Топливщик',
                department: 'Топливщики твёрд',
                workDays: 25,
                schedule: parseScheduleString('11110011111001111001111001111')
            },
            'tovar.sd': {
                name: 'Товар С.Д.',
                position: 'Топливщик',
                department: 'Топливщики твёрд',
                workDays: 27,
                schedule: parseScheduleString('111110111110111110111110111')
            },
            'borchenko.kv': {
                name: 'Борченко К.В.',
                position: 'Топливщик',
                department: 'Топливщики твёрд',
                workDays: 25,
                schedule: parseScheduleString('11110011111001111001111001111')
            },
            'gerasimov.ar': {
                name: 'Герасимов А.Р.',
                position: 'Топливщик',
                department: 'Топливщики твёрд',
                workDays: 25,
                schedule: parseScheduleString('11110011111001111001111001111')
            },
            'chernakov.ev': {
                name: 'Чернаков Е.В.',
                position: 'Топливщик Н-Ф',
                department: 'Топливщики Н-Ф',
                workDays: 25,
                schedule: parseScheduleString('11110011111001111001111001111')
            },
            'radchenko.va': {
                name: 'Радченко В.А.',
                position: 'Топливщик Н-Ф',
                department: 'Топливщики Н-Ф',
                workDays: 25,
                schedule: parseScheduleString('11110011111001111001111001111')
            },
            'sedenkova.nv': {
                name: 'Седенкова Н.В.',
                position: 'Топливщик форсунки',
                department: 'Топливщики форсунки',
                workDays: 25,
                schedule: parseScheduleString('11110011111001111001111001111')
            },
            'danylko.op': {
                name: 'Данилко О.П.',
                position: 'Топливщик форсунки',
                department: 'Топливщики форсунки',
                workDays: 26,
                schedule: parseScheduleString('111110111110111110111110111')
            },
            'usach.is': {
                name: 'Усач И.С.',
                position: 'Топливщик форсунки',
                department: 'Топливщики форсунки',
                workDays: 26,
                schedule: parseScheduleString('111110111110111110111110111')
            },
            
            // Слесарный цех
            'babenko.a': {
                name: 'Бабенко А (пом зн)',
                position: 'Помощник',
                department: 'Слесарный цех',
                workDays: 27,
                schedule: parseScheduleString('111110111110111110111110111')
            },
            'babenko.e': {
                name: 'Бабенко Е.(пом зн)',
                position: 'Помощник',
                department: 'Слесарный цех',
                workDays: 25,
                schedule: parseScheduleString('11110011111001111001111001111')
            },
            'lisyj.os': {
                name: 'Лисий О.С.',
                position: 'Слесарь',
                department: 'Слесарь',
                workDays: 25,
                schedule: parseScheduleString('11110011111001111001111001111')
            },
            'oborin.oleg': {
                name: 'Оборин Олег',
                position: 'Слесарь',
                department: 'Слесарь',
                workDays: 25,
                schedule: parseScheduleString('11110011111001111001111001111')
            },
            'korenickij.evgenij': {
                name: 'Кореницкий Евгений',
                position: 'Слесарь',
                department: 'Слесарь',
                workDays: 25,
                schedule: parseScheduleString('11110011111001111001111001111')
            },
            'nikolaev.aurel': {
                name: 'Николаев Аурел',
                position: 'Слесарь',
                department: 'Слесарь',
                workDays: 25,
                schedule: parseScheduleString('11110011111001111001111001111')
            },
            
            // Турбинный цех
            'yakovlev.ri': {
                name: 'Яковлев Р.И.',
                position: 'Турбинщик',
                department: 'Турбинный цех',
                workDays: 25,
                schedule: parseScheduleString('11110011111001111001111001111')
            },
            'molodina.yut': {
                name: 'Молодина Ю.Т.',
                position: 'Турбинщик',
                department: 'Турбинный цех',
                workDays: 24,
                schedule: parseScheduleString('1111001111001111001111001111')
            },
            'alekseev.vn': {
                name: 'Алексеев В.Н.',
                position: 'Турбинщик',
                department: 'Турбинный цех',
                workDays: 24,
                schedule: parseScheduleString('1111001111001111001111001111')
            },
            
            // Бухгалтерия
            'kortunova.tn': {
                name: 'Кортунова Т.Н.',
                position: 'Бухгалтер',
                department: 'Бухгалтерия',
                workDays: 25,
                schedule: parseScheduleString('11110011111001111001111001111')
            },
            'lobanov.d': {
                name: 'Лобанов Д. Курьер',
                position: 'Курьер',
                department: 'Бухгалтерия',
                workDays: 27,
                schedule: parseScheduleString('111110111110111110111110111')
            },
            'bezuglyj.vv': {
                name: 'Безуглый В.В. завх',
                position: 'Завхоз',
                department: 'Бухгалтерия',
                workDays: 23,
                schedule: parseScheduleString('1111001111001111001111001111')
            }
        }
    };
    
    this.init();
}

// Методы ScheduleManager
ScheduleManager.prototype.init = function() {
    console.log('ScheduleManager инициализирован с данными из таблицы');
    this.updateUserScheduleInfo();
};

ScheduleManager.prototype.updateUserScheduleInfo = function() {
    if (!window.usersDatabase) return;
    
    Object.keys(this.scheduleData.employees).forEach(userId => {
        if (window.usersDatabase[userId]) {
            const scheduleInfo = this.scheduleData.employees[userId];
            window.usersDatabase[userId].workDays = scheduleInfo.workDays;
            window.usersDatabase[userId].department = scheduleInfo.department;
            window.usersDatabase[userId].schedule = scheduleInfo.schedule;
        }
    });
};

ScheduleManager.prototype.getEmployeeSchedule = function(userId, year, month) {
    if (this.scheduleData.employees[userId]) {
        return this.scheduleData.employees[userId].schedule;
    }
    return {};
};

ScheduleManager.prototype.isEmployeeAvailable = function(userId, targetDate = null) {
    const employee = this.scheduleData.employees[userId];
    if (!employee) return false;
    
    let day;
    if (targetDate) {
        if (typeof targetDate === 'string') {
            targetDate = new Date(targetDate);
        }
        day = targetDate.getDate();
    } else {
        day = new Date().getDate();
    }
    
    return employee.schedule[day] === 'work';
};

ScheduleManager.prototype.getDepartmentStatistics = function() {
    const stats = {};
    const today = new Date().getDate();
    
    Object.values(this.scheduleData.employees).forEach(employee => {
        const dept = employee.department;
        if (!stats[dept]) {
            stats[dept] = {
                totalEmployees: 0,
                workingToday: 0
            };
        }
        stats[dept].totalEmployees++;
        
        if (employee.schedule[today] === 'work') {
            stats[dept].workingToday++;
        }
    });
    
    return stats;
};

ScheduleManager.prototype.getScheduleTableData = function() {
    return {
        month: this.scheduleData.month,
        year: this.scheduleData.year,
        employees: this.scheduleData.employees
    };
};

// Экспорт для глобального использования
window.ScheduleManager = ScheduleManager;

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log('ScheduleManager готов к использованию');
});
