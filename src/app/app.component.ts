import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  public taxBrackets = [
    {
      from: 0,
      to: 10777,
      rate: 0,
      color: '#eee',
      matched: false,
      lastMatched: false,
      amount: 0,
    },
    {
      from: 10777,
      to: 27478,
      rate: 11,
      color: '#fff600',
      matched: false,
      lastMatched: false,
      amount: 0,
    },
    {
      from: 27478,
      to: 78570,
      rate: 30,
      color: '#faa60c',
      matched: false,
      lastMatched: false,
      amount: 0,
    },
    {
      from: 78570,
      to: 168994,
      rate: 41,
      color: '#f66018',
      matched: false,
      lastMatched: false,
      amount: 0,
    },
    {
      from: 168994,
      to: Infinity,
      rate: 45,
      color: '#f12323',
      matched: false,
      lastMatched: false,
      amount: 0,
    },
  ];
  public readonly minIncome = 0;
  public readonly maxIncome = Number.MAX_SAFE_INTEGER;
  public readonly incomeInput = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(this.minIncome),
    Validators.max(this.maxIncome),
  ]);
  public income = 0;
  public gridTemplateColumns = '';
  public totalTaxAmount = 0;
  public totalTaxPercent = 0;

  public ngOnInit(): void {
    if (document.location.hash === '#2019') {
      this.taxBrackets = [
        {
          ...this.taxBrackets[0],
          from: 0,
          to: 10064,
          rate: 0,
        },
        {
          ...this.taxBrackets[1],
          from: 10064,
          to: 27794,
          rate: 14,
        },
        {
          ...this.taxBrackets[2],
          from: 27794,
          to: 74517,
          rate: 30,
        },
        {
          ...this.taxBrackets[3],
          from: 74517,
          to: 157806,
          rate: 41,
        },
        {
          ...this.taxBrackets[4],
          from: 157806,
          to: Infinity,
          rate: 45,
        },
      ];
    }
    else if (document.location.hash === '#2020') {
      this.taxBrackets = [
        {
          ...this.taxBrackets[0],
          from: 0,
          to: 10084,
          rate: 0,
        },
        {
          ...this.taxBrackets[1],
          from: 10084,
          to: 25710,
          rate: 11,
        },
        {
          ...this.taxBrackets[2],
          from: 25710,
          to: 73516,
          rate: 30,
        },
        {
          ...this.taxBrackets[3],
          from: 73516,
          to: 158122,
          rate: 41,
        },
        {
          ...this.taxBrackets[4],
          from: 158122,
          to: Infinity,
          rate: 45,
        },
      ];
    }
    else if (document.location.hash === '#2021') {
      this.taxBrackets = [
        {
          ...this.taxBrackets[0],
          from: 0,
          to: 10225,
          rate: 0,
        },
        {
          ...this.taxBrackets[1],
          from: 10225,
          to: 26070,
          rate: 11,
        },
        {
          ...this.taxBrackets[2],
          from: 26070,
          to: 74545,
          rate: 30,
        },
        {
          ...this.taxBrackets[3],
          from: 74545,
          to: 160336,
          rate: 41,
        },
        {
          ...this.taxBrackets[4],
          from: 160336,
          to: Infinity,
          rate: 45,
        },
      ];
    }
    this.updateGraph();
    this.incomeInput.valueChanges.subscribe(() => {
      this.income = this.incomeInput.value ?? 0;
      if (this.incomeInput.valid) {
        this.updateGraph();
      }
    });
  }

  public decreaseIncome(amount: number): void {
    if (this.incomeInput.value && this.incomeInput.value - amount >= this.minIncome) {
      this.incomeInput.setValue(this.incomeInput.value - amount);
    }
  }

  public increaseIncome(amount: number): void {
    if (!this.incomeInput.value) {
      this.incomeInput.setValue(amount);
    }
    else if (this.incomeInput.value + amount <= this.maxIncome) {
      this.incomeInput.setValue(this.incomeInput.value + amount);
    }
  }

  public updateGraph(): void {
    let incomeRest = this.income;
    const gridTemplateColumns: Array<string> = [];
    for (const taxBracket of this.taxBrackets) {
      taxBracket.lastMatched = false;
      if (incomeRest < 0) {
        taxBracket.matched = false;
        taxBracket.amount = 0;
      }
      else {
        taxBracket.matched = true;
        const bracketSize = taxBracket.to - taxBracket.from;
        incomeRest -= bracketSize;
        if (incomeRest < 0) {
          taxBracket.lastMatched = true;
          const bracketIncome = (this.income - taxBracket.from) || 1;
          taxBracket.amount = Math.round(bracketIncome / 100 * taxBracket.rate);
          if (bracketSize === Infinity) {
            gridTemplateColumns.push(`${bracketIncome}fr min-content`);
          }
          else {
            gridTemplateColumns.push(`${bracketIncome}fr min-content min-content min-content`);
          }
        }
        else {
          taxBracket.amount = Math.round(bracketSize / 100 * taxBracket.rate);
          gridTemplateColumns.push(`${bracketSize}fr min-content`);
        }
      }
    }
    this.gridTemplateColumns = gridTemplateColumns.join(' ');
    this.totalTaxAmount = this.taxBrackets.reduce((totalTaxAmount, taxBracket) => totalTaxAmount + taxBracket.amount, 0);
    this.totalTaxPercent = Math.round((this.totalTaxAmount * 100 / this.income) * 10) / 10;
  }

}
