export class ProjectsError extends Error {
  constructor(public kind: keyof typeof API_PROJECTS_ERROR_MESSAGES) {
    super(API_PROJECTS_ERROR_MESSAGES[kind])
    this.name = 'ProjectsError'
  }
}

const API_PROJECTS_ERROR_MESSAGES = {
  not_found: 'Проект с таким id не найден',
  empty_body: 'Не передано ни одно поле для изменения',
  unknown: 'Неизвестная ошибка',
	server: 'Ошибка сервера'
}
