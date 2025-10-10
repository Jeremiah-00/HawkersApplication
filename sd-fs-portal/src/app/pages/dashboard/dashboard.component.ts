import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="flex items-center justify-between p-4 md:p-6">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-vodafone-red"></div>
          <span class="text-xl md:text-2xl font-semibold truncate max-w-[60vw]">{{ email }}</span>
        </div>
        <div class="relative">
          <button (click)="toggleUserMenu()" class="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">👤</button>
          <div *ngIf="showUserMenu" class="absolute right-0 mt-2 w-40 bg-white border rounded shadow">
            <button (click)="logout()" class="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
          </div>
        </div>
      </div>

      <div class="mx-3 md:mx-auto max-w-5xl border rounded shadow bg-white">
        <div class="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 p-4">
          <input [(ngModel)]="query" placeholder="Search by MSISDN" class="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vodafone-red" />
          <button (click)="downloadExcel()" class="flex items-center gap-2 bg-vodafone-red text-white px-4 py-2 rounded hover:bg-vodafone-dark">
            <span>Download</span>
            <span>⬇️</span>
          </button>
        </div>

        <div class="px-4 pb-4">
          <table class="w-full text-xs md:text-sm">
            <thead>
              <tr class="text-left text-gray-500">
                <th class="w-8"></th>
                <th class="py-2">HAWKER</th>
                <th class="py-2">CUSTOMER</th>
                <th class="py-2">ACTIVATION DATE</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of filteredRows" class="border-t">
                <td class="py-3"><input type="checkbox" /></td>
                <td class="py-3">{{ row.hawker }}</td>
                <td class="py-3">{{ row.customer }}</td>
                <td class="py-3">{{ row.activation }}</td>
              </tr>
            </tbody>
          </table>
          <div class="flex items-center justify-center gap-6 text-gray-500 mt-4">
            <button class="px-2" (click)="prevPage()" [disabled]="page===1">←</button>
            <span>{{ page }}|{{ totalPages }}</span>
            <button class="px-2" (click)="nextPage()" [disabled]="page===totalPages">→</button>
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
  email = '';
  page = 1;
  totalPages = 10;
  pageSize = 6;
  rows: Array<{ hawker: string; customer: string; activation: string }> = [];
  constructor(private auth: AuthService, private router: Router) {
    this.email = this.auth.getUserEmail() || 'User';
    this.rows = this.generateRows(this.page);
  }
  get filteredRows() {
    const q = this.query.trim();
    if (!q) return this.rows;
    return this.rows.filter(r =>
      r.hawker.includes(q) || r.customer.includes(q) || r.activation.includes(q)
    );
  }
  toggleUserMenu() { this.showUserMenu = !this.showUserMenu; }
  logout() { this.auth.logout(); this.router.navigateByUrl('/login'); }
  prevPage() { if (this.page>1) { this.page--; this.rows = this.generateRows(this.page); } }
  nextPage() { if (this.page<this.totalPages) { this.page++; this.rows = this.generateRows(this.page); } }
  private generateRows(page: number) {
    const rows = [] as Array<{ hawker: string; customer: string; activation: string }>;
    for (let i = 0; i < this.pageSize; i++) {
      rows.push({
        hawker: this.randomMsisdn(8),
        customer: this.randomMsisdn(9),
        activation: this.randomDateString(page, i),
      });
    }
    return rows;
  }
  private randomMsisdn(length: number) {
    const prefix = '266 ';
    const digits = Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
    return `${prefix}${digits}`;
  }
  private randomDateString(page: number, idx: number) {
    const base = new Date(2023, 0, 1); // Jan 1, 2023
    const offsetDays = page * 3 + idx * 2 + Math.floor(Math.random() * 5);
    const d = new Date(base.getTime() + offsetDays * 24 * 60 * 60 * 1000);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(Math.floor(Math.random() * 23)).padStart(2, '0');
    const min = String(Math.floor(Math.random() * 59)).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  }
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
