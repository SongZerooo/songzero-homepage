window.SongZeroProfile = (function() {
  var profileUrl = 'profile.json';

  function load() {
    return fetch(profileUrl, { cache: 'no-cache' }).then(function(response) {
      if (!response.ok) throw new Error('无法读取 profile.json');
      return response.json();
    }).then(function(profile) {
      if (!profile || !profile.basic || !Array.isArray(profile.sections)) {
        throw new Error('profile.json 格式无效');
      }
      return profile;
    });
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function(character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }

  function section(profile, id) {
    return profile.sections.find(function(item) { return item.id === id; }) || null;
  }

  return { load: load, escapeHtml: escapeHtml, section: section };
})();
