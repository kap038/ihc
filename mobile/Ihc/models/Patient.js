import {stringDate} from '../util/Date';
export default class Patient {
  // Insert any class methods here
  get drugUpdates() {
    const drugToUpdates = {};
    for (var update of this.medications) {
      if (update.name in drugToUpdates) {
        drugToUpdates[update.name].push(update);
      } else{
        drugToUpdates[update.name] = [update];
      }
    }
    return drugToUpdates;
  }

  get age() {
    const strBirthday = this.birthday;
    const today = stringDate(new Date());
    const birthdayYear = parseInt(strBirthday.slice(0,4)); // Get the year
    const birthdayMonthDay= parseInt(strBirthday.slice(4));
    const todayYear = parseInt(today.slice(0,4));
    const todayMonthDay = parseInt(today.slice(4));

    let age = todayYear - birthdayYear;
    // If hasn't passed their birthday this year, then subtract
    if(birthdayMonthDay < todayMonthDay) {
      age--;
    }
    return age;
  }

  /* Returns {
   *   weights: [[ageInMonths, weight (kg)],...]},
   *   heights: [[ageInMonths, height (cm)],...]}
   * }
   */
  get growthChartData() {
    const triages = this.triages;
    const weights = [];
    const heights = [];
    triages.forEach( triage => {
      const ageInMonths = triage.age * 12; // Rounds off to whole year, should be fine
      weights.push([ageInMonths, triage.weight]);
      heights.push([ageInMonths, triage.height]);
    });
    return {weights, heights};
  }

  get isMale() {
    return this.gender === 1;
  }

  static fullName(patient) {
    return `${patient.firstName} ${patient.fatherName} ${patient.motherName}`;
  }

  // To be used as primary key
  static makeKey(patient) {
    const str = `${patient.firstName}&${patient.fatherName}&${patient.motherName}` +
      `&${patient.birthday}`;
    return str;
  }

  static extractFromForm(form) {
    const patient = Object.assign({}, form);
    patient.birthday = stringDate(form.birthday);
    patient.key = Patient.makeKey(patient);
    if(form.newPatient) {
      // 1 is male, 2 is female
      patient.gender = form.gender === 'Male' ? 1 : 2;
      patient.lastUpdated = new Date().getTime();
    }
    return patient;
  }
}

Patient.schema = {
  name: 'Patient',
  primaryKey: 'key',
  properties: {
    key: 'string',
    firstName: 'string',
    fatherName: 'string', // last name
    motherName: 'string', // last name
    birthday: 'string',
    gender: 'int', // 1 = boy, 2 = girl, 0 = undefined
    phone: 'string?',
    motherHeight: 'double?',
    fatherHeight: 'double?',
    medications: 'DrugUpdate[]',
    soaps: 'Soap[]',
    triages: 'Triage[]',
    statuses: 'Status[]',
    lastUpdated: 'int' // timestamp
  }
};