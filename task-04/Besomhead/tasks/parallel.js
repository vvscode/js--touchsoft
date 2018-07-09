/* exported Parallel */

/**
 * Реализовать класс, который позволяет запускать задачи параллельно
 * с заданным числом параллельно выполняющихся задач
 *
 *   var runner = new Parallel(2);
 *   runner
 *     .job(step0)
 *     .job(step1)
 *     .job(step2)
 *     .job(step3)
 *     .job(step4)
 *     .done(onDone);
 *
 *  Задача представляет из себя функцию, принимающую коллбэк, для информирования о результате работы
 */

function Parallel(poolSize) {
  var self = this;
  this.poolSize = poolSize || 1;
  this.jobs = [];
  this.jobsResult = [];
  this.asyncJobs = [];
  this.onDone = undefined;
  this.job = function job(task) {
    this.jobs.push(task);
    return self;
  };
  this.done = function done(onDone) {
    var jobID;
    var job;
    if (typeof onDone !== "function") {
      self.jobsResult.push(onDone);
    }

    self.onDone = self.onDone || onDone;

    self.asyncJobs.shift();
    if (self.jobs.length === 0 && self.asyncJobs.length === 0) {
      setTimeout(self.onDone, 0, self.jobsResult);
      return;
    }

    if (!self.asyncJobs.length) {
      while (self.asyncJobs.length < self.poolSize && self.jobs.length) {
        job = self.jobs.shift();
        jobID = setTimeout(job.bind(self, self.done, self.jobsResult), 0);
        self.asyncJobs.push(jobID);
      }
    }
  };
}
