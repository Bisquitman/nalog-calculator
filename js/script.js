//* Форматирование числа 
// (разделение тысяч пробелами, количество знаков после запятой, etc.)
const formatNumber = (value) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    maximumFractionDigits: 2,
  }).format(value);
};

//* Навигация
const navigation = () => {
  const navigationLinks = document.querySelectorAll('.navigation__link');
  const calcElems = document.querySelectorAll('.calc');

  for (let i = 0; i < navigationLinks.length; i += 1) {
    navigationLinks[i].addEventListener('click', (e) => {
      e.preventDefault();
      for (let j = 0; j < calcElems.length; j += 1) {
        if (navigationLinks[i].dataset.tax === calcElems[j].dataset.tax) {
          calcElems[j].classList.add('calc_active');
          navigationLinks[j].classList.add('navigation__link_active');
        } else {
          calcElems[j].classList.remove('calc_active');
          navigationLinks[j].classList.remove('navigation__link_active');
        }
      }
    });
  }
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
      calcLabelExpenses.style.display = 'block';
      resultTaxTotal.textContent = formatNumber(
        (formAusn.income.value - formAusn.expenses.value) * 0.2,
      ); // 20%
    }
  });

  calcBtnReset.addEventListener('click', () => {
    formAusn.reset();
    calcLabelExpenses.style.display = 'none';
    resultTaxTotal.textContent = 0;
  });
};
ausnCalc();


//* калькулятор для самозанятых
const selfEmploymentCalc = () => {
  const selfEmployment = document.querySelector('.self-employment');
  const formselfEmployment = selfEmployment.querySelector('.calc__form');
  const resultTaxTotal = selfEmployment.querySelector('.result__tax_total');
  const calcBtnReset = selfEmployment.querySelector('.calc__btn-reset');

  formselfEmployment.addEventListener('input', () => {
    resultTaxTotal.textContent = formatNumber(
      formselfEmployment.individuals.value * 0.04 +
        formselfEmployment.legal.value * 0.06,
    );
  });

  calcBtnReset.addEventListener('click', () => {
    formselfEmployment.reset();
    resultTaxTotal.textContent = 0;
  });
};
selfEmploymentCalc();
