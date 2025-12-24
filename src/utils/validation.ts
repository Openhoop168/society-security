/**
 * 数据验证工具函数
 */

/**
 * 验证邮箱格式
 * @param email 邮箱地址
 * @returns 是否有效
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证手机号格式（中国大陆）
 * @param phone 手机号
 * @returns 是否有效
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * 验证身份证号格式（中国大陆）
 * @param idCard 身份证号
 * @returns 是否有效
 */
export function isValidIdCard(idCard: string): boolean {
  const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return idCardRegex.test(idCard);
}

/**
 * 验证工资数据
 * @param salary 工资金额
 * @returns 验证结果
 */
export function validateSalary(salary: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (salary === null || salary === undefined || salary === '') {
    errors.push('工资金额不能为空');
  } else {
    const numSalary = parseFloat(salary);
    if (isNaN(numSalary)) {
      errors.push('工资金额必须是数字');
    } else if (numSalary < 0) {
      errors.push('工资金额不能为负数');
    } else if (numSalary > 10000000) {
      errors.push('工资金额超出合理范围');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 验证员工姓名
 * @param name 员工姓名
 * @returns 验证结果
 */
export function validateEmployeeName(name: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!name || name.trim() === '') {
    errors.push('员工姓名不能为空');
  } else if (name.length > 50) {
    errors.push('员工姓名不能超过50个字符');
  } else if (!/^[\u4e00-\u9fa5a-zA-Z\s]+$/.test(name)) {
    errors.push('员工姓名只能包含中文、英文和空格');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 验证月份格式 (YYYYMM)
 * @param month 月份字符串
 * @returns 验证结果
 */
export function validateMonth(month: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!month) {
    errors.push('月份不能为空');
    return { isValid: false, errors };
  }

  const monthRegex = /^\d{6}$/;
  if (!monthRegex.test(month)) {
    errors.push('月份格式不正确，应为YYYYMM格式');
  } else {
    const year = parseInt(month.substring(0, 4));
    const monthNum = parseInt(month.substring(4, 6));

    if (year < 2000 || year > 2100) {
      errors.push('年份应在2000-2100之间');
    }

    if (monthNum < 1 || monthNum > 12) {
      errors.push('月份应在1-12之间');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 验证城市社保标准数据
 * @param cityStandard 城市社保标准对象
 * @returns 验证结果
 */
export function validateCityStandard(cityStandard: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // 验证城市名称
  if (!cityStandard.city_name || cityStandard.city_name.trim() === '') {
    errors.push('城市名称不能为空');
  }

  // 验证年份
  if (!cityStandard.year || cityStandard.year < 2000 || cityStandard.year > 2100) {
    errors.push('年份应在2000-2100之间');
  }

  // 验证基数
  if (!cityStandard.base_min || cityStandard.base_min < 0) {
    errors.push('社保基数下限不能为空或负数');
  }

  if (!cityStandard.base_max || cityStandard.base_max < 0) {
    errors.push('社保基数上限不能为空或负数');
  }

  if (cityStandard.base_min && cityStandard.base_max && cityStandard.base_min > cityStandard.base_max) {
    errors.push('社保基数下限不能大于上限');
  }

  // 验证各项比例（应在0-1之间）
  const rateFields = [
    'pension_company', 'pension_employee',
    'medical_company', 'medical_employee',
    'unemployment_company', 'unemployment_employee',
    'injury_company', 'injury_employee',
    'maternity_company', 'maternity_employee',
    'housing_fund_company', 'housing_fund_employee'
  ];

  rateFields.forEach(field => {
    const value = cityStandard[field];
    if (value === null || value === undefined || value === '') {
      errors.push(`${field} 不能为空`);
    } else {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0 || numValue > 1) {
        errors.push(`${field} 必须是0-1之间的数字`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}