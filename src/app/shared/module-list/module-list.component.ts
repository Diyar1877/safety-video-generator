import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RoleIconPipe } from '../pipes/role-icon.pipe';

@Component({
  selector: 'app-module-list',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatIconModule, MatSlideToggleModule, MatTooltipModule, RoleIconPipe],
  templateUrl: './module-list.component.html',
  styleUrl: './module-list.component.scss'
})
export class ModuleListComponent {
  modules = [
    { name: 'userAdministration', label: 'safety² · Basis',             file: null,                                  enabled: true  },
    { name: 'observation',        label: 'Beobachtungen',                file: '01-Beobachtung.mp4',                  enabled: false },
    { name: 'audit',              label: 'Audits & Begehungen',          file: '02-Audit-Begehung.mp4',               enabled: false },
    { name: 'hazardAssessment',   label: 'Gefährdungsbeurteilungen',     file: '03-GBU.mp4',                          enabled: false },
    { name: 'instruction',        label: 'Betriebsanweisungen',          file: '04-Betriebanweisung.mp4',             enabled: false },
    { name: 'schooling',          label: 'Unterweisungen',               file: '05-Unterweisung.mp4',                 enabled: false },
    { name: 'qualification',      label: 'Qualifikationen',              file: '06-Qualification.mp4',                enabled: false },
    { name: 'medical',            label: 'Unfallmanagement',             file: '07-Unfallmanegment.mp4',              enabled: false },
    { name: 'screening',          label: 'Arbeitsmedizinische Vorsorge', file: '08-Arbeit-Medizinische-Vorsorge.mp4', enabled: false },
    { name: 'inspection',         label: 'Prüf.- & Wartungsplaner',      file: '09-Pruf-Wartung.mp4',                 enabled: false },
    { name: 'externalCompanies',  label: 'Fremdfirmenmanagement',        file: '10-Fremdfirma.mp4',                   enabled: false },
    { name: 'measurement',        label: 'Maßnahmen',                    file: '11-Massnahmen.mp4',                   enabled: false },
    { name: 'hazardousSubstance', label: 'Gefahrstoffmanagement',        file: '12-Gefahrstoffe.mp4',                 enabled: false },
    { name: 'controlling',        label: 'Monitoring',                   file: '13-Monitoring.mp4',                   enabled: false },
  ];

}
