import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="flex items-center justify-between p-6">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-vodafone-red"></div>
          <span class="text-2xl font-semibold">Test User</span>
        </div>
        <div class="relative" (click)="toggleUserMenu()">
          <button class="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">👤</button>
          <div *ngIf="showUserMenu" class="absolute right-0 mt-2 w-40 bg-white border rounded shadow">
            <button (click)="logout()" class="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
          </div>
        </div>
      </div>

      <div class="mx-auto max-w-4xl border rounded shadow bg-white">
        <div class="flex items-center gap-4 p-4">
          <input [(ngModel)]="query" placeholder="Search by MSISDN" class="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vodafone-red" />
          <button (click)="downloadExcel()" class="flex items-center gap-2 bg-vodafone-red text-white px-4 py-2 rounded hover:bg-vodafone-dark">
            <span>Download</span>
            <span>⬇️</span>
          </button>
        </div>

        <div class="px-4 pb-4">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-gray-500">
                <th class="w-8"></th>
                <th class="py-2">HAWKER</th>
                <th class="py-2">CUSTOMER</th>
                <th class="py-2">ACTIVATION DATE</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of rows" class="border-t">
                <td class="py-3"><input type="checkbox" /></td>
                <td class="py-3">{{ row.hawker }}</td>
                <td class="py-3">{{ row.customer }}</td>
                <td class="py-3">{{ row.activation }}</td>
              </tr>
            </tbody>
          </table>
          <div class="flex items-center justify-center gap-6 text-gray-500 mt-4">
            <button class="px-2">←</button>
            <span>1|10</span>
            <button class="px-2">→</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class DashboardComponent {
  showUserMenu = false;
  query = '';
  rows = [
    { hawker: '266 5123456', customer: '266 51515151', activation: '05/01/2023 1:29' },
    { hawker: '266 5123456', customer: '266 51515151', activation: '02/01/2023 12:23' },
    { hawker: '266 5123456', customer: '266 51515151', activation: '22/12/2022 13:12' },
    { hawker: '266 5123456', customer: '266 51515151', activation: '20/12/2022 16:29' },
    { hawker: '266 5123456', customer: '266 51515151', activation: '18/12/2022 12:26' },
    { hawker: '266 5123456', customer: '266 51515151', activation: '15/12/2022 14:48' },
  ];
  toggleUserMenu() { this.showUserMenu = !this.showUserMenu; }
  logout() { window.location.href = '/login'; }
  async downloadExcel() {
    // Dynamically import XLSX to reduce bundle size
    const xlsx = await import('xlsx');
    const worksheet = xlsx.utils.json_to_sheet(this.rows);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Report');
    const wbout = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sd-fs-report.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
