//* Форматирование числа
// (разделение тысяч пробелами, количество знаков после запятой, etc.)
const formatNumber = (value) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  }).format(value);
};

const debounceTimer = (fn, msec) => {
  let lastCall = 0;
  let lastCallTimer = NaN;

  return (...args) => {
    const previousCall = lastCall;
    lastCall = Date.now();

    if (previousCall && lastCall - previousCall <= msec) {
      clearTimeout(lastCallTimer);
    }

    lastCallTimer = setTimeout(() => {
      fn(...args);
    }, msec);
  };
};

//* Навигация
const navigation = () => {
  const navigationLinks = document.querySelectorAll('.navigation__link');
  const calcElems = document.querySelectorAll('.calc');

  navigationLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      navigationLinks.forEach((link) => {
        link.classList.remove('navigation__link_active');
      });

      calcElems.forEach((calcElem) => {
        if (link.dataset.tax === calcElem.dataset.tax) {
          calcElem.classList.add('calc_active');
          link.classList.add('navigation__link_active');
        } else {
          calcElem.classList.remove('calc_active');
        }
      });
    });
  });
};
navigation();

//* Инициализация всех полей с результатами
const resultTaxInit = () => {
  const resultTax = document.querySelectorAll('.result__tax');
  resultTax.forEach((element) => {
    element.textContent = formatNumber(0);
  });
};
resultTaxInit();

//* Калькулятор АУСН
const ausnCalc = () => {
  const ausn = document.querySelector('.ausn');
  const formAusn = ausn.querySelector('.calc__form');
  const resultTaxTotal = ausn.querySelector('.result__tax_total');
  const calcLabelExpenses = ausn.querySelector('.calc__label_expenses');
  const calcBtnReset = ausn.querySelector('.calc__btn-reset');

  calcLabelExpenses.style.display = 'none';

  formAusn.addEventListener(
    'input',
    debounceTimer(() => {
      // income, expenses - значения атрибута "name" инпута формы

      const IncomeValue = +formAusn.income.value;

      if (formAusn.type.value === 'income') {
        calcLabelExpenses.style.display = 'none';
        formAusn.expenses.value = '';
        resultTaxTotal.textContent =
          IncomeValue * 0.08 > 0 ? formatNumber(IncomeValue * 0.08) : 0;
      }
      if (formAusn.type.value === 'expenses') {
        calcLabelExpenses.style.display = '';

        const expensesValue = +formAusn.expenses.value;
        const profit = IncomeValue - expensesValue;

        resultTaxTotal.textContent =
          profit * 0.2 > 0 ? formatNumber(profit * 0.2) : 0;
      }
    }, 500),
  );

  calcBtnReset.addEventListener('click', () => {
    formAusn.reset();
    calcLabelExpenses.style.display = 'none';
    resultTaxTotal.textContent = formatNumber(0);
  });
};
ausnCalc();

//* калькулятор для самозанятых и ИП НПД
const selfEmploymentCalc = () => {
  const selfEmployment = document.querySelector('.self-employment');
  const formSelfEmployment = selfEmployment.querySelector('.calc__form');
  const resultTax = selfEmployment.querySelectorAll('.result__tax');
  const resultTaxTotal = selfEmployment.querySelector('.result__tax_total');
  const calcBtnReset = selfEmployment.querySelector('.calc__btn-reset');
  const calcLabelCompensation = selfEmployment.querySelector(
    '.calc__label_compensation',
  );
  const resultBlockCompensation = selfEmployment.querySelectorAll(
    '.result__block_compensation',
  );
  const resultTaxCompensation = selfEmployment.querySelector(
    '.result__tax_compensation',
  );
  const resultTaxRestCompensation = selfEmployment.querySelector(
    '.result__tax_rest-compensation',
  );
  const resultTaxResult = selfEmployment.querySelector('.result__tax_result');

  const checkCompensation = () => {
    const setDisplay = formSelfEmployment.addCompensation.checked ? '' : 'none';
    calcLabelCompensation.style.display = setDisplay;

    resultBlockCompensation.forEach((element) => {
      element.style.display = setDisplay;
    });
  };

  checkCompensation();

  formSelfEmployment.addEventListener(
    'input',
    debounceTimer(() => {
      const individual = +formSelfEmployment.individuals.value; // физ. лицо
      const legal = +formSelfEmployment.legal.value; // юр. лицо
      const resIndividual = individual * 0.04; // Налог на доход с физ. лиц
      const resLegal = legal * 0.06; // Налог на доход с юр. лиц

      checkCompensation();

      const tax = resIndividual + resLegal; // Общий налог

      formSelfEmployment.compensation.value =
        +formSelfEmployment.compensation.value > 10_000
          ? 10_000
          : formSelfEmployment.compensation.value;

      const benefit = +formSelfEmployment.compensation.value; // Налоговый вычет
      const resBenefit = individual * 0.01 + legal * 0.02;
      const finalBenefit = benefit - resBenefit > 0 ? benefit - resBenefit : 0;
      const realBenefit = benefit - finalBenefit;
      const finalTax = tax - realBenefit; // Окончательный налог

      resultTaxTotal.textContent = tax >= 0 ? formatNumber(tax) : 0;
      resultTaxCompensation.textContent =
        realBenefit >= 0 ? formatNumber(realBenefit) : 0;
      resultTaxRestCompensation.textContent =
        formSelfEmployment.compensation.value >= 0
          ? formatNumber(formSelfEmployment.compensation.value)
          : 0;
      resultTaxResult.textContent = finalTax >= 0 ? formatNumber(finalTax) : 0;
    }, 500),
  );

  calcBtnReset.addEventListener('click', () => {
    formSelfEmployment.reset();
    resultTax.forEach((element) => {
      element.textContent = formatNumber(0);
    });
    checkCompensation();
  });
};
selfEmploymentCalc();

//* Калькулятор ОСНО
const osnoCalc = () => {
  const osno = document.querySelector('.osno');
  const formOsno = osno.querySelector('.calc__form');
  const calcBtnReset = osno.querySelector('.calc__btn-reset');

  const ndflExpenses = osno.querySelector('.result__block_ndfl-expenses');
  const ndflIncome = osno.querySelector('.result__block_ndfl-income');
  const Profit = osno.querySelector('.result__block_profit');

  const resultTax = osno.querySelectorAll('.result__tax');
  const resultTaxNds = osno.querySelector('.result__tax_nds');
  const resultTaxProperty = osno.querySelector('.result__tax_property');
  const resultTaxNdflExpenses = osno.querySelector(
    '.result__tax_ndfl-expenses',
  );
  const resultTaxNdflIncome = osno.querySelector('.result__tax_ndfl-income');
  const resultTaxProfit = osno.querySelector('.result__tax_profit');

  const checkFormBusiness = () => {
    if (formOsno.formBusiness.value === 'ip') {
      ndflExpenses.style.display = '';
      ndflIncome.style.display = '';
      Profit.style.display = 'none';
    }
    if (formOsno.formBusiness.value === 'ooo') {
      ndflExpenses.style.display = 'none';
      ndflIncome.style.display = 'none';
      Profit.style.display = '';
    }
  };
  checkFormBusiness();

  formOsno.addEventListener(
    'input',
    debounceTimer(() => {
      checkFormBusiness();

      const income = +formOsno.income.value;
      const expenses = +formOsno.expenses.value;
      const property = +formOsno.property.value;

      const profit = income - expenses;

      // НДС
      const nds = income * 0.2;
      resultTaxNds.textContent = nds >= 0 ? formatNumber(nds) : 0;

      // Налог на имущество
      const taxProperty = property * 0.02;
      resultTaxProperty.textContent =
        taxProperty >= 0 ? formatNumber(taxProperty) : 0;

      // НДФЛ(Вычет в виде расходов)
      const ndflExpensesTotal = profit * 0.13;
      resultTaxNdflExpenses.textContent =
        ndflExpensesTotal >= 0 ? formatNumber(ndflExpensesTotal) : 0;

      // НДФЛ(Вычет 20% от доходов)
      const ndflIncomeTotal = (income - nds) * 0.13;
      resultTaxNdflIncome.textContent =
        ndflIncomeTotal >= 0 ? formatNumber(ndflIncomeTotal) : 0;

      // Налог на прибыль 20%
      const taxProfit = profit * 0.2;
      resultTaxProfit.textContent =
        taxProfit >= 0 ? formatNumber(taxProfit) : 0;
    }, 500),
  );

  calcBtnReset.addEventListener('click', () => {
    formOsno.reset();
    resultTax.forEach((element) => {
      element.textContent = formatNumber(0);
    });
    checkFormBusiness();
  });
};
osnoCalc();

//* Калькулятор УСН
const usnCalc = () => {
  const LIMIT = 300_000;
  const usn = document.querySelector('.usn');
  const formUsn = usn.querySelector('.calc__form');
  const calcBtnReset = usn.querySelector('.calc__btn-reset');

  const calcLabelExpenses = usn.querySelector('.calc__label_expenses');
  const calcLabelProperty = usn.querySelector('.calc__label_property');
  const resultBlockProperty = usn.querySelector('.result__block_property');

  const resultTax = usn.querySelectorAll('.result__tax');
  const resultTaxTotal = usn.querySelector('.result__tax_total');
  const resultTaxProperty = usn.querySelector('.result__tax_property');

  // через switch/case
  // const checkShowProperty = (typeTax) => {
  //   switch (typeTax) {
  //     case 'income': {
  //       calcLabelExpenses.style.display = 'none';
  //       calcLabelProperty.style.display = 'none';
  //       resultBlockProperty.style.display = 'none';

  //       formUsn.expenses.value = '';
  //       formUsn.property.value = '';
  //       break;
  //     }

  //     case 'ip-expenses': {
  //       calcLabelExpenses.style.display = '';
  //       calcLabelProperty.style.display = 'none';
  //       resultBlockProperty.style.display = 'none';

  //       formUsn.property.value = '';
  //       break;
  //     }

  //     case 'ooo-expenses': {
  //       calcLabelExpenses.style.display = '';
  //       calcLabelProperty.style.display = '';
  //       resultBlockProperty.style.display = '';
  //       break;
  //     }
  //   }
  // };

  // через объект
  const typeTax = {
    income: () => {
      calcLabelExpenses.style.display = 'none';
      calcLabelProperty.style.display = 'none';
      resultBlockProperty.style.display = 'none';

      formUsn.expenses.value = '';
      formUsn.property.value = '';
    },
    'ip-expenses': () => {
      calcLabelExpenses.style.display = '';
      calcLabelProperty.style.display = 'none';
      resultBlockProperty.style.display = 'none';

      formUsn.property.value = '';
    },
    'ooo-expenses': () => {
      calcLabelExpenses.style.display = '';
      calcLabelProperty.style.display = '';
      resultBlockProperty.style.display = '';
    },
  };

  // через switch/case
  // checkShowProperty(formUsn.typeTax.value);

  const percent = {
    income: 0.06,
    'ip-expenses': 0.15,
    'ooo-expenses': 0.15,
  };

  // через объект
  typeTax[formUsn.typeTax.value]();

  formUsn.addEventListener(
    'input',
    debounceTimer(() => {
      typeTax[formUsn.typeTax.value]();

      const income = +formUsn.income.value;
      const expenses = +formUsn.expenses.value;
      const сontributions = +formUsn.сontributions.value;
      const property = +formUsn.property.value;

      let profit = income - сontributions;

      if (formUsn.typeTax.value !== 'income') {
        profit -= expenses;
      }

      const taxBigIncome = income > LIMIT ? (profit - LIMIT) * 0.01 : 0;
      const sum = profit - (taxBigIncome < 0 ? 0 : taxBigIncome);
      const tax = sum * percent[formUsn.typeTax.value];
      const taxProperty = property * 0.02;

      resultTaxTotal.textContent = tax >= 0 ? formatNumber(tax) : 0;
      resultTaxProperty.textContent =
        taxProperty >= 0 ? formatNumber(taxProperty) : 0;
    }, 500),
  );

  calcBtnReset.addEventListener('click', () => {
    formUsn.reset();
    resultTax.forEach((element) => {
      element.textContent = formatNumber(0);
      typeTax[formUsn.typeTax.value]();
    });
  });
};
usnCalc();

//* Калькулятор Налоговый вычет 13%
const taxReturnCalc = () => {
  const taxReturn = document.querySelector('.tax-return');
  const formTaxReturn = taxReturn.querySelector('.calc__form');
  const calcBtnReset = taxReturn.querySelector('.calc__btn-reset');

  const resultTax = taxReturn.querySelectorAll('.result__tax');
  const resultTaxNdfl = taxReturn.querySelector('.result__tax_ndfl');
  const resultTaxPossible = taxReturn.querySelector('.result__tax_possible');
  const resultTaxDeduction = taxReturn.querySelector('.result__tax_deduction');

  formTaxReturn.addEventListener('input', debounceTimer(() => {
    const income = +formTaxReturn.income.value;
    const expenses = +formTaxReturn.expenses.value;
    const sumExpenses = +formTaxReturn.sumExpenses.value;

    const ndfl = income * 0.13;
    const possibleDeduction =
      expenses < sumExpenses ? expenses * 0.13 : sumExpenses * 0.13;
    const deduction = possibleDeduction < ndfl ? possibleDeduction : ndfl;

    resultTaxNdfl.textContent = ndfl >= 0 ? formatNumber(ndfl) : 0;
    resultTaxPossible.textContent =
      possibleDeduction >= 0 ? formatNumber(possibleDeduction) : 0;
    resultTaxDeduction.textContent =
      deduction >= 0 ? formatNumber(deduction) : 0;
  }, 500));

  calcBtnReset.addEventListener('click', () => {
    formTaxReturn.reset();
    resultTax.forEach((element) => {
      element.textContent = formatNumber(0);
    });
  });
};
taxReturnCalc();
