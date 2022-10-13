//* Форматирование числа
// (разделение тысяч пробелами, количество знаков после запятой, etc.)
const formatNumber = (value) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  }).format(value);
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

//* Калькулятор АУСН
const ausnCalc = () => {
  const ausn = document.querySelector('.ausn');
  const formAusn = ausn.querySelector('.calc__form');
  const resultTaxTotal = ausn.querySelector('.result__tax_total');
  const calcLabelExpenses = ausn.querySelector('.calc__label_expenses');
  const calcBtnReset = ausn.querySelector('.calc__btn-reset');

  calcLabelExpenses.style.display = 'none';

  formAusn.addEventListener('input', () => {
    // income, expenses - значения атрибута "name" инпута формы

    if (formAusn.type.value === 'income') {
      calcLabelExpenses.style.display = 'none';
      formAusn.expenses.value = '';
      resultTaxTotal.textContent = formatNumber(formAusn.income.value * 0.08); // 8%
    }
    if (formAusn.type.value === 'expenses') {
      calcLabelExpenses.style.display = '';
      resultTaxTotal.textContent = formatNumber(
        (formAusn.income.value - formAusn.expenses.value) * 0.2,
      ); // 20%
    }
  });

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
  const formselfEmployment = selfEmployment.querySelector('.calc__form');
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
    const setDisplay = formselfEmployment.addCompensation.checked ? '' : 'none';
    calcLabelCompensation.style.display = setDisplay;

    resultBlockCompensation.forEach((element) => {
      element.style.display = setDisplay;
    });
  };

  checkCompensation();

  formselfEmployment.addEventListener('input', () => {
    const resIndividual = formselfEmployment.individuals.value * 0.04; // Налог на доход с физ. лиц
    const resLegal = formselfEmployment.legal.value * 0.06; // Налог на доход с юр. лиц

    checkCompensation();

    const tax = resIndividual + resLegal; // Общий налог
    formselfEmployment.compensation.value =
      formselfEmployment.compensation.value > 10_000
        ? 10_000
        : formselfEmployment.compensation.value;
    const benefit = formselfEmployment.compensation.value; // Налоговый вычет
    const resBenefit =
      formselfEmployment.individuals.value * 0.01 +
      formselfEmployment.legal.value * 0.02;
    const finalBenefit = benefit - resBenefit > 0 ? benefit - resBenefit : 0;
    const realBenefit = benefit - finalBenefit;
    const finalTax = tax - realBenefit; // Окончательный налог

    resultTaxTotal.textContent = formatNumber(tax);
    resultTaxCompensation.textContent = formatNumber(realBenefit);
    resultTaxRestCompensation.textContent = formatNumber(finalBenefit);
    resultTaxResult.textContent = formatNumber(finalTax);
  });

  calcBtnReset.addEventListener('click', () => {
    formselfEmployment.reset();
    resultTaxTotal.textContent = formatNumber(0);
    resultBlockCompensation.forEach((element) => {
      element.textContent = formatNumber(0);
    });
    checkCompensation();
  });
};
selfEmploymentCalc();

//* Калькулятор ОСНО
const calcOsno = () => {
  const osno = document.querySelector('.osno');
  const formOsno = osno.querySelector('.calc__form');

  const ndflExpenses = osno.querySelector('.result__block_ndfl-expenses');
  const ndflIncome = osno.querySelector('.result__block_ndfl-income');
  const Profit = osno.querySelector('.result__block_profit');

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

  formOsno.addEventListener('input', () => {
    checkFormBusiness();

    const income = formOsno.income.value;
    const expenses = formOsno.expenses.value;
    const property = formOsno.property.value;

    const profit = income - expenses;

    // НДС
    const nds = income * 0.2;
    resultTaxNds.textContent = nds >= 0 ? formatNumber(nds) : '#Н/Д';

    // Налог на имущество
    const taxProperty = property * 0.02;
    resultTaxProperty.textContent =
      taxProperty >= 0 ? formatNumber(taxProperty) : '#Н/Д';

    // НДФЛ(Вычет в виде расходов)
    const ndflExpensesTotal = profit * 0.13;
    resultTaxNdflExpenses.textContent =
      ndflExpensesTotal >= 0 ? formatNumber(ndflExpensesTotal) : '#Н/Д';

    // НДФЛ(Вычет 20% от доходов)
    const ndflIncomeTotal = (income - nds) * 0.13;
    resultTaxNdflIncome.textContent =
      ndflIncomeTotal >= 0 ? formatNumber(ndflIncomeTotal) : '#Н/Д';

    // Налог на прибыль 20%
    const taxProfit = profit * 0.2;
    resultTaxProfit.textContent =
      taxProfit >= 0 ? formatNumber(taxProfit) : '#Н/Д';
  });
};
calcOsno();