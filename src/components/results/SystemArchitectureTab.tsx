'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Network, 
  Layers, 
  Database, 
  Code2, 
  GitBranch,
  Shield,
  Server,
  Cloud,
  Lock,
  Key,
  FileCode,
  Workflow,
  AlertCircle
} from 'lucide-react';
import type { SystemArchitecture } from '@/types';

interface SystemArchitectureTabProps {
  architecture: SystemArchitecture;
  lang: 'en' | 'th';
}

export function SystemArchitectureTab({ architecture, lang }: SystemArchitectureTabProps) {

    console.log("architecture", architecture);
  return (
    <div className="space-y-6">
      {/* Architecture Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-primary" />
            <CardTitle>{architecture.overview.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            {architecture.overview.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <div className="text-sm text-muted-foreground mb-1">
                {lang === 'th' ? 'ประเภท Architecture' : 'Architecture Type'}
              </div>
              <div className="font-semibold">{architecture.overview.architectureType}</div>
            </div>
            
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <div className="text-sm text-muted-foreground mb-1">
                {lang === 'th' ? 'Architecture Pattern' : 'Architecture Pattern'}
              </div>
              <div className="font-semibold">{architecture.overview.architecturePattern}</div>
            </div>
            
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <div className="text-sm text-muted-foreground mb-1">
                {lang === 'th' ? 'Deployment Model' : 'Deployment Model'}
              </div>
              <div className="font-semibold">{architecture.overview.deploymentModel}</div>
            </div>
            
            {architecture.overview.cloudProvider && (
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <div className="text-sm text-muted-foreground mb-1">
                  {lang === 'th' ? 'Cloud Provider' : 'Cloud Provider'}
                </div>
                <div className="font-semibold flex items-center gap-2">
                  <Cloud className="w-4 h-4" />
                  {architecture.overview.cloudProvider}
                </div>
              </div>
            )}
          </div>

          {/* Architecture Layers */}
          <div className="space-y-3 mt-6">
            <h4 className="font-semibold flex items-center gap-2">
              <Layers className="w-4 h-4" />
              {lang === 'th' ? 'Layers' : 'Layers'}
            </h4>
            {architecture.overview.diagram.layers.map((layer, idx) => (
              <div key={idx} className="p-4 border rounded-lg space-y-2">
                <div className="font-medium">{layer.name}</div>
                <p className="text-sm text-muted-foreground">{layer.description}</p>
                <div className="flex flex-wrap gap-2">
                  {layer.technologies.map((tech, i) => (
                    <Badge key={i} variant="outline">{tech}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Key Decisions */}
          <div className="space-y-2 mt-6">
            <h4 className="font-semibold flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              {lang === 'th' ? 'การตัดสินใจสำคัญ' : 'Key Decisions'}
            </h4>
            <ul className="space-y-2">
              {architecture.overview.keyDecisions.map((decision, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-1">•</span>
                  <span>{decision}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Components Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            <CardTitle>{architecture.components.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Frontend Components */}
          {architecture.components.frontendComponents.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">
                {lang === 'th' ? 'Frontend Components' : 'Frontend Components'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {architecture.components.frontendComponents.map((component, idx) => (
                  <div key={idx} className="p-4 border rounded-lg space-y-2 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                    <div className="font-medium">{component.name}</div>
                    <p className="text-sm text-muted-foreground">{component.description}</p>
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground">
                        {lang === 'th' ? 'ความรับผิดชอบ:' : 'Responsibilities:'}
                      </div>
                      <ul className="text-xs space-y-1">
                        {component.responsibilities.map((resp, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-primary">•</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {component.technologies.map((tech, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{tech}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Backend Services */}
          {architecture.components.backendServices.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Server className="w-4 h-4" />
                {lang === 'th' ? 'Backend Services' : 'Backend Services'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {architecture.components.backendServices.map((service, idx) => (
                  <div key={idx} className="p-4 border rounded-lg space-y-2 bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                    <div className="font-medium">{service.name}</div>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground">
                        {lang === 'th' ? 'ความรับผิดชอบ:' : 'Responsibilities:'}
                      </div>
                      <ul className="text-xs space-y-1">
                        {service.responsibilities.map((resp, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-primary">•</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {service.technologies.map((tech, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{tech}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Databases */}
          {architecture.components.databases.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Database className="w-4 h-4" />
                {lang === 'th' ? 'Databases' : 'Databases'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {architecture.components.databases.map((db, idx) => (
                  <div key={idx} className="p-4 border rounded-lg space-y-2 bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
                    <div className="font-medium">{db.name}</div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{db.type}</Badge>
                      <Badge variant="outline" className="text-xs">{db.technology}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{db.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* External Services */}
          {architecture.components.externalServices.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Cloud className="w-4 h-4" />
                {lang === 'th' ? 'External Services' : 'External Services'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {architecture.components.externalServices.map((service, idx) => (
                  <div key={idx} className="p-4 border rounded-lg space-y-2 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                    <div className="font-medium">{service.name}</div>
                    <p className="text-sm text-muted-foreground">{service.purpose}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">{lang === 'th' ? 'Provider:' : 'Provider:'}</span>
                      <span className="font-medium">{service.provider}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">{service.integrationMethod}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Design */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-primary" />
            <CardTitle>{architecture.apiDesign.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-muted/50 border">
              <div className="text-sm text-muted-foreground mb-1">API Style</div>
              <div className="font-semibold">{architecture.apiDesign.apiStyle}</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 border">
              <div className="text-sm text-muted-foreground mb-1">Versioning</div>
              <div className="font-semibold">{architecture.apiDesign.apiVersioning}</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 border">
              <div className="text-sm text-muted-foreground mb-1">Authentication</div>
              <div className="font-semibold">{architecture.apiDesign.authenticationMethod}</div>
            </div>
          </div>

          {/* API Endpoints */}
          <div className="space-y-4 mt-6">
            <h4 className="font-semibold">{lang === 'th' ? 'API Endpoints' : 'API Endpoints'}</h4>
            {architecture.apiDesign.endpoints.map((module, idx) => (
              <div key={idx} className="border rounded-lg p-4 space-y-3">
                <div className="font-medium text-primary">{module.module}</div>
                <div className="text-sm text-muted-foreground font-mono">{module.baseUrl}</div>
                <div className="space-y-2">
                  {module.endpoints.map((endpoint, endIdx) => (
                    <div key={endIdx} className="p-3 bg-muted/30 rounded border-l-4 border-l-primary space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge 
                          variant={endpoint.method === 'GET' ? 'default' : endpoint.method === 'POST' ? 'secondary' : 'outline'}
                          className="font-mono"
                        >
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm">{endpoint.path}</code>
                      </div>
                      <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">Auth:</span>
                        <Badge variant="outline" className="text-xs">{endpoint.authentication}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Error Handling */}
          <div className="space-y-3 mt-6">
            <h4 className="font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {lang === 'th' ? 'การจัดการ Error' : 'Error Handling'}
            </h4>
            <p className="text-sm text-muted-foreground">{architecture.apiDesign.errorHandling.format}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {architecture.apiDesign.errorHandling.commonCodes.map((code, idx) => (
                <div key={idx} className="p-2 border rounded text-sm">
                  <span className="font-mono font-semibold">{code.code}</span>
                  <span className="text-muted-foreground ml-2">{code.meaning}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Model */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            <CardTitle>{architecture.dataModel.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{architecture.dataModel.description}</p>
          
          {/* Entities */}
          <div className="space-y-4 mt-6">
            <h4 className="font-semibold">{lang === 'th' ? 'Entities' : 'Entities'}</h4>
            {architecture.dataModel.entities.map((entity, idx) => (
              <div key={idx} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-lg">{entity.name}</div>
                    <p className="text-sm text-muted-foreground">{entity.description}</p>
                  </div>
                </div>

                {/* Attributes */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">
                    {lang === 'th' ? 'Attributes:' : 'Attributes:'}
                  </div>
                  <div className="space-y-1">
                    {entity.attributes.map((attr, attrIdx) => (
                      <div key={attrIdx} className="flex items-start gap-2 text-sm p-2 bg-muted/30 rounded">
                        <code className="font-mono font-medium">{attr.name}</code>
                        <Badge variant="outline" className="text-xs">{attr.type}</Badge>
                        {attr.required && (
                          <Badge variant="destructive" className="text-xs">required</Badge>
                        )}
                        <span className="text-muted-foreground ml-auto">{attr.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Relationships */}
                {entity.relationships.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">
                      {lang === 'th' ? 'Relationships:' : 'Relationships:'}
                    </div>
                    <div className="space-y-1">
                      {entity.relationships.map((rel, relIdx) => (
                        <div key={relIdx} className="flex items-center gap-2 text-sm p-2 bg-blue-50/50 dark:bg-blue-950/20 rounded">
                          <GitBranch className="w-3 h-3 text-primary" />
                          <span className="font-medium">{rel.relatedEntity}</span>
                          <Badge variant="outline" className="text-xs">{rel.type}</Badge>
                          <span className="text-muted-foreground text-xs">- {rel.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Indexes */}
                {entity.indexes.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">{lang === 'th' ? 'Indexes:' : 'Indexes:'}</span>
                    {entity.indexes.map((index, indexIdx) => (
                      <Badge key={indexIdx} variant="secondary" className="text-xs font-mono">
                        {index}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Data Flow */}
          <div className="space-y-2 mt-6">
            <h4 className="font-semibold">{lang === 'th' ? 'Data Flow' : 'Data Flow'}</h4>
            <p className="text-sm text-muted-foreground">{architecture.dataModel.dataFlowDescription}</p>
          </div>

          {/* Cache Strategy */}
          <div className="space-y-2 mt-6 p-4 bg-muted/30 rounded-lg border">
            <h4 className="font-semibold text-sm">{lang === 'th' ? 'Cache Strategy' : 'Cache Strategy'}</h4>
            <p className="text-sm text-muted-foreground">{architecture.dataModel.cacheStrategy.description}</p>
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">
                {lang === 'th' ? 'ข้อมูลที่จะ Cache:' : 'Cached Data:'}
              </div>
              <div className="flex flex-wrap gap-2">
                {architecture.dataModel.cacheStrategy.cachedData.map((data, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">{data}</Badge>
                ))}
              </div>
              <div className="text-xs">
                <span className="font-medium text-muted-foreground">
                  {lang === 'th' ? 'Invalidation Strategy:' : 'Invalidation Strategy:'}
                </span>
                <span className="ml-2">{architecture.dataModel.cacheStrategy.invalidationStrategy}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Flows */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Workflow className="w-5 h-5 text-primary" />
            <CardTitle>{architecture.keyFlows.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {architecture.keyFlows.flows.map((flow, idx) => (
            <div key={idx} className="border rounded-lg p-4 space-y-4">
              <div>
                <div className="font-medium text-lg">{flow.name}</div>
                <p className="text-sm text-muted-foreground">{flow.description}</p>
              </div>

              {/* Actors */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">{lang === 'th' ? 'Actors:' : 'Actors:'}</span>
                {flow.actors.map((actor, actorIdx) => (
                  <Badge key={actorIdx} variant="secondary">{actor}</Badge>
                ))}
              </div>

              {/* Steps */}
              <div className="space-y-2">
                <div className="text-sm font-medium">{lang === 'th' ? 'Steps:' : 'Steps:'}</div>
                <div className="space-y-2">
                  {flow.steps.map((step, stepIdx) => (
                    <div key={stepIdx} className="flex gap-3 p-3 bg-muted/30 rounded">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                        {step.step}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">{step.actor}</Badge>
                          <span className="text-sm font-medium">{step.action}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">System:</span> {step.system}
                        </div>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alternative Flows */}
              {flow.alternativeFlows.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">
                    {lang === 'th' ? 'Alternative Flows:' : 'Alternative Flows:'}
                  </div>
                  <ul className="space-y-1">
                    {flow.alternativeFlows.map((altFlow, altIdx) => (
                      <li key={altIdx} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-muted-foreground">{altFlow}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Business Rules */}
              {flow.businessRules.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">
                    {lang === 'th' ? 'Business Rules:' : 'Business Rules:'}
                  </div>
                  <ul className="space-y-1">
                    {flow.businessRules.map((rule, ruleIdx) => (
                      <li key={ruleIdx} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-muted-foreground">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <CardTitle>{architecture.security.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">{architecture.security.overview}</p>

          {/* Authentication */}
          <div className="border rounded-lg p-4 space-y-3 bg-blue-50/30 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 font-semibold">
              <Key className="w-4 h-4" />
              {lang === 'th' ? 'Authentication' : 'Authentication'}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{lang === 'th' ? 'Method:' : 'Method:'}</span>
                <Badge variant="secondary">{architecture.security.authentication.method}</Badge>
              </div>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">{lang === 'th' ? 'Implementation:' : 'Implementation:'}</span> {architecture.security.authentication.implementation}</p>
                <p><span className="font-medium">{lang === 'th' ? 'Token Management:' : 'Token Management:'}</span> {architecture.security.authentication.tokenManagement}</p>
                <p><span className="font-medium">{lang === 'th' ? 'Session Management:' : 'Session Management:'}</span> {architecture.security.authentication.sessionManagement}</p>
              </div>
            </div>
          </div>

          {/* Authorization */}
          <div className="border rounded-lg p-4 space-y-3 bg-green-50/30 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 font-semibold">
              <Lock className="w-4 h-4" />
              {lang === 'th' ? 'Authorization' : 'Authorization'}
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{lang === 'th' ? 'Model:' : 'Model:'}</span>
                <Badge variant="secondary">{architecture.security.authorization.model}</Badge>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">{lang === 'th' ? 'Roles:' : 'Roles:'}</div>
                {architecture.security.authorization.roles.map((role, idx) => (
                  <div key={idx} className="p-3 bg-background rounded border space-y-2">
                    <div className="font-medium">{role.name}</div>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((perm, permIdx) => (
                        <Badge key={permIdx} variant="outline" className="text-xs">{perm}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-sm">
                <span className="font-medium">{lang === 'th' ? 'Implementation:' : 'Implementation:'}</span>
                <p className="text-muted-foreground mt-1">{architecture.security.authorization.implementation}</p>
              </div>
            </div>
          </div>

          {/* Data Protection */}
          <div className="border rounded-lg p-4 space-y-3 bg-purple-50/30 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 font-semibold">
              <Shield className="w-4 h-4" />
              {lang === 'th' ? 'Data Protection' : 'Data Protection'}
            </div>
            <div className="text-sm space-y-2">
              <p><span className="font-medium">{lang === 'th' ? 'Encryption at Rest:' : 'Encryption at Rest:'}</span> {architecture.security.dataProtection.encryptionAtRest}</p>
              <p><span className="font-medium">{lang === 'th' ? 'Encryption in Transit:' : 'Encryption in Transit:'}</span> {architecture.security.dataProtection.encryptionInTransit}</p>
              <p><span className="font-medium">{lang === 'th' ? 'Sensitive Data Handling:' : 'Sensitive Data Handling:'}</span> {architecture.security.dataProtection.sensitiveDataHandling}</p>
              <p><span className="font-medium">{lang === 'th' ? 'Data Retention:' : 'Data Retention:'}</span> {architecture.security.dataProtection.dataRetention}</p>
            </div>
          </div>

          {/* Security Measures */}
          <div className="space-y-3">
            <h4 className="font-semibold">
              {lang === 'th' ? 'Security Measures' : 'Security Measures'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {architecture.security.securityMeasures.map((measure, idx) => (
                <div key={idx} className="p-4 border rounded-lg space-y-2">
                  <div className="font-medium">{measure.category}</div>
                  <p className="text-sm text-muted-foreground">{measure.implementation}</p>
                  <div className="flex flex-wrap gap-1">
                    {measure.tools.map((tool, toolIdx) => (
                      <Badge key={toolIdx} variant="outline" className="text-xs">{tool}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance */}
          <div className="border rounded-lg p-4 space-y-3 bg-amber-50/30 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
            <h4 className="font-semibold">{lang === 'th' ? 'Compliance' : 'Compliance'}</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">{lang === 'th' ? 'Standards:' : 'Standards:'}</span>
                {architecture.security.compliance.standards.map((standard, idx) => (
                  <Badge key={idx} variant="secondary">{standard}</Badge>
                ))}
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">{lang === 'th' ? 'Requirements:' : 'Requirements:'}</div>
                <ul className="space-y-1">
                  {architecture.security.compliance.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Monitoring */}
          <div className="border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold">{lang === 'th' ? 'Security Monitoring' : 'Security Monitoring'}</h4>
            <div className="text-sm space-y-2">
              <p><span className="font-medium">{lang === 'th' ? 'Logging:' : 'Logging:'}</span> {architecture.security.monitoring.logging}</p>
              <p><span className="font-medium">{lang === 'th' ? 'Alerting:' : 'Alerting:'}</span> {architecture.security.monitoring.alerting}</p>
              <p><span className="font-medium">{lang === 'th' ? 'Audit Trail:' : 'Audit Trail:'}</span> {architecture.security.monitoring.auditTrail}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

