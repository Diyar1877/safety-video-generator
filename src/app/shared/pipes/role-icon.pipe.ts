import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleIcon',
  standalone: true
})
export class RoleIconPipe implements PipeTransform {
  transform(roleName: string): string {
    switch (roleName) {
      case 'userAdministration': return 'room_preferences';
      case 'observation':        return 'visibility';
      case 'audit':              return 'find_in_page';
      case 'hazardAssessment':   return 'warning';
      case 'instruction':        return 'assignment';
      case 'schooling':          return 'school';
      case 'qualification':      return 'verified';
      case 'medical':            return 'local_hospital';
      case 'screening':          return 'multiline_chart';
      case 'inspection':         return 'construction';
      case 'maintenance':        return 'construction';
      case 'externalCompanies':  return 'business_center';
      case 'measurement':        return 'feedback';
      case 'hazardousSubstance': return 'science';
      case 'controlling':        return 'monitoring';
      default:                   return roleName;
    }
  }
}
