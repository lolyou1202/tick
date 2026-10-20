import { Injectable, inject } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable, catchError, throwError } from 'rxjs'
import { Project } from './project.model'
import { API_BASE_URL } from '../../core/config/tokens'
import { ProjectsError } from './project.errors'

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly _http = inject(HttpClient)
  private readonly _apiBaseUrl = inject(API_BASE_URL)

  public getProjects(): Observable<Project[]> {
    return this._http.get<Project[]>(`${this._apiBaseUrl}/projects`).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) {
          return throwError(() => new ProjectsError('not_found'))
        }
        if (err.status === 403) {
          return throwError(() => new ProjectsError('server'))
        }
        return throwError(() => new ProjectsError('unknown'))
      })
    )
  }

  public getProject(id: Pick<Project, 'id'>): Observable<Project> {
    return this._http.get<Project>(`${this._apiBaseUrl}/projects/${id}`).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) {
          return throwError(() => new ProjectsError('not_found'))
        }
        if (err.status === 403) {
          return throwError(() => new ProjectsError('server'))
        }
        return throwError(() => new ProjectsError('unknown'))
      })
    )
  }

  public createProject(body: Omit<Project, 'id'>): Observable<Project> {
    return this._http
      .post<Project>(`${this._apiBaseUrl}/projects`, { body })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 403) {
            return throwError(() => new ProjectsError('server'))
          }
          return throwError(() => new ProjectsError('unknown'))
        })
      )
  }

  public updateProject(
    id: Pick<Project, 'id'>,
    body: Partial<Omit<Project, 'id'>>
  ): Observable<Project> {
    if (!body || Object.keys(body).length === 0) {
      return throwError(() => new ProjectsError('empty_body'))
    }
    return this._http
      .patch<Project>(`${this._apiBaseUrl}/projects/${id}`, {
        body
      })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 404) {
            return throwError(() => new ProjectsError('not_found'))
          }
          if (err.status === 403) {
            return throwError(() => new ProjectsError('server'))
          }
          return throwError(() => new ProjectsError('unknown'))
        })
      )
  }

  public deleteProject(id: Pick<Project, 'id'>): Observable<void> {
    return this._http.delete<void>(`${this._apiBaseUrl}/projects/${id}`).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) {
          return throwError(() => new ProjectsError('not_found'))
        }
        if (err.status === 403) {
          return throwError(() => new ProjectsError('server'))
        }
        return throwError(() => new ProjectsError('unknown'))
      })
    )
  }
}
