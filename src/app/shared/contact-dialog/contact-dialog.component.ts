import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-contact-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule,
  ],
  templateUrl: './contact-dialog.component.html',
  styleUrl: './contact-dialog.component.scss',
})
export class ContactDialogComponent {
  anrede = '';
  vorname = '';
  nachname = '';
  firma = '';
  mitarbeiter = '';
  telefon = '';
  email = '';
  datenschutz = false;

  modules = [
    { name: 'alle',                label: 'Alle',                            icon: 'select_all',       enabled: false },
    { name: 'userAdministration', label: 'safety² · Basis',                 icon: 'room_preferences', enabled: true },
    { name: 'observation',        label: 'Beobachtungen',                   icon: 'visibility',       enabled: false },
    { name: 'audit',             label: 'Audits & Begehungen',           icon: 'find_in_page',    enabled: false },
    { name: 'hazardAssessment',  label: 'Gefährdungsbeurteilung',        icon: 'warning',         enabled: false },
    { name: 'instruction',       label: 'Betriebsanweisungen',           icon: 'assignment',      enabled: false },
    { name: 'schooling',         label: 'Unterweisungen',                icon: 'school',          enabled: false },
    { name: 'qualification',     label: 'Qualifikationen',               icon: 'verified',        enabled: false },
    { name: 'medical',           label: 'Unfallmanagement',              icon: 'local_hospital',  enabled: false },
    { name: 'screening',         label: 'Arbeitsmedizinische Vorsorge',  icon: 'multiline_chart', enabled: false },
    { name: 'externalCompanies', label: 'Fremdfirmen',                   icon: 'business_center', enabled: false },
    { name: 'measurement',       label: 'Maßnahmen',                     icon: 'feedback',        enabled: false },
    { name: 'inspection',        label: 'Prüfmittelbuch & Wartungsplaner', icon: 'construction',  enabled: false },
    { name: 'hazardousSubstance', label: 'Gefahrstoffmanagement',          icon: 'science',       enabled: false },
    { name: 'controlling',        label: 'Monitoring',                     icon: 'monitoring',    enabled: false },
  ];

  constructor(
    private dialogRef: MatDialogRef<ContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { enabledModules: string[] } | null,
  ) {
    if (data?.enabledModules) {
      for (const mod of this.modules) {
        if (mod.name === 'alle') continue;
        if (mod.name === 'userAdministration') continue;
        mod.enabled = data.enabledModules.includes(mod.name);
      }
    }
  }

  onAlleChange(enabled: boolean): void {
    this.modules[0].enabled = enabled;
    for (let i = 1; i < this.modules.length; i++) {
      if (this.modules[i].name === 'userAdministration') continue;
      this.modules[i].enabled = enabled;
    }
  }

  get isValid(): boolean {
    return !!(this.vorname && this.nachname && this.email && this.datenschutz);
  }

  send(): void {
    if (!this.isValid) return;
    const selectedModules = this.modules.filter(m => m.enabled && m.name !== 'alle').map(m => m.label);
    const payload = {
      anrede: this.anrede,
      vorname: this.vorname,
      nachname: this.nachname,
      firma: this.firma,
      mitarbeiter: this.mitarbeiter,
      telefon: this.telefon,
      email: this.email,
      module: selectedModules,
    };
    this.dialogRef.close(payload);
  }

  close(): void {
    this.dialogRef.close(null);
  }
}
