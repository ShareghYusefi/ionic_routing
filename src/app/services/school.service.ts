import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../interfaces/student';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  // api endpoint for school database
  _schoolUrl = 'http://localhost:3000';

  // use dependency inject to work with an instance of HttpClient class
  constructor(private httpInstance: HttpClient) {}

  // we want an Observable object that will return an array of Students
  getStudents(): Observable<Student[]> {
    // We can use < > to specify the type of data we expect to get back
    return this.httpInstance.get<Student[]>(this._schoolUrl + '/students');
  }

  // we want a specific student
  getStudent(id: number): Observable<Student> {
    return this.httpInstance.get<Student>(this._schoolUrl + '/students/' + id);
  }

  // add student to database
  addStudent(student: Student): Observable<Student> {
    console.log('school service: ', student);

    // TODO: Figure out why student is passed in as an empty object
    return this.httpInstance.post<Student>(
      this._schoolUrl + '/students',
      student
    );
  }

  // update student data
  updateStudent(id: number, updatedStudent: Student): Observable<Student> {
    return this.httpInstance.patch<Student>(
      this._schoolUrl + '/students/' + id,
      updatedStudent
    );
  }

  // delete student by id
  deleteStudent(id: number): Observable<Student> {
    // We can use < > to specify the type of data we expect to get back
    return this.httpInstance.delete<Student>(
      this._schoolUrl + '/students/' + id
    );
  }
}
