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
  this.poolSize = poolSize || 1;
  this.jobs = [];
  this.jobsResult = [];
  this.asyncJobs = [];
  this.job = function job(task) {
    this.jobs.push(task);
    return this;
  };
  this.done = function done(onDone) {
    var self = this;
    var jobID;
    if (typeof onDone !== "function") {
      self.jobsResult.push(onDone);
      return;
    }
    self.asyncJobs.shift();
    if (self.jobs.length === 0 && self.asyncJobs.length === 0) {
      setTimeout(onDone, 0, self.jobsResult);
      return;
    }

    while (self.asyncJobs.length < self.poolSize) {
      jobID = setTimeout(function callJob() {
        self.jobs.shift().call(self, self.done);
      }, 0);
      self.asyncJobs.push(jobID);
    }
  };
}

Parallel();
