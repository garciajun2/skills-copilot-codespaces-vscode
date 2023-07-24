function skillsMember() {
  return {
    restrict: 'E',
    templateUrl: 'templates/skills-member.html',
    controller: 'SkillsMemberCtrl',
    controllerAs: 'skillsMember',
    bindToController: true,
    scope: {
      member: '='
    }
  };
}