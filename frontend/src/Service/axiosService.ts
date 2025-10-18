export class ApiEndpoints {
  private static base: string = "http://127.0.0.1:8000/api";

  static auth = {
    register: () => `${this.base}/users`,
    login: () => `${this.base}/users/login`,
  };

  static tasks = {
    create: () => `${this.base}/tasks`,
    getMonth: (userId: string, year : number, month: number) => 
      `${this.base}/tasks/${userId}/count-for-every-month-day?year=${year}&month=${month}`,
    get: (userId: string, date: string) => 
      `${this.base}/tasks/${userId}/${date}`,
    delete: (taskId: string | number) => `${this.base}/tasks/${taskId}`,
  };
}
