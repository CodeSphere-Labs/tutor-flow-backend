export const ErrorMessages = {
  ACCESS_DENIED: 'Access denied: invalid refresh token',
  INVALID_CREDENTIALS: 'Invalid email or password',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
  INVALID_TOKEN: 'Invalid token',
} as const;

export const SuccessMessages = {
  LOGGED_OUT: 'Logged out successfully',
} as const;

export const ApiDescriptions = {
  REGISTER:
    'Создает нового пользователя (репетитора или ученика) в системе. ' +
    'В зависимости от указанной роли (TUTOR или STUDENT) создается соответствующий профиль.',
  SIGN_IN: 'Аутентификация пользователя в системе',
  SIGN_OUT: 'Выход из системы',
} as const;

export const SubscriptionApiDescriptions = {
  CHECK_TRIAL_STATUS:
    'Проверяет статус пробной подписки для преподавателя и возвращает информацию о количестве оставшихся дней',
  GET_ACTIVE_SUBSCRIPTION:
    'Получает информацию об активной подписке преподавателя',
  UPGRADE_SUBSCRIPTION:
    'Обновляет подписку преподавателя с пробной на платную или меняет текущий план на новый',
} as const;
