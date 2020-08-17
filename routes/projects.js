const express = require('express')
const router = express.Router()
const { projects } = require('../data')
const { authUser } = require('../basicAuth')
const { canViewProject, scopedProjects, canDeleteProject } = require('../permissions/project')

router.use(authUser)

router.get('/', (req, res) => {
  res.json(scopedProjects(req.user, projects))
})

router.get('/:projectId', setProject, authGetProject, (req, res) => {
  res.json(req.project)
})

router.delete('/:projectId', setProject, authDeleteProject, (req, res) => {
  res.send('Deleted Project')
})

function setProject(req, res, next) {
  const projectId = parseInt(req.params.projectId)
  req.project = projects.find(p => p.id === projectId)

  if (req.project == null) {
    res.status(404)
    return res.send('Project not found')
  }
  next()
}

function authGetProject(req, res, next) {
  if (!canViewProject(req.user, req.project)) {
    res.status(401)
    return res.send('Not Allowed')
  }
  next()
}

function authDeleteProject(req, res, next) {
  if (!canDeleteProject(req.user, req.project)) {
    res.status(401)
    return res.send('Not Allowed')
  }

  next()
}

module.exports = router
