import graphene
from graphene_django import DjangoObjectType
from analyzer.models import Resume, Analysis


class ResumeType(DjangoObjectType):
    class Meta:
        model = Resume
        fields = '__all__'


class AnalysisType(DjangoObjectType):
    class Meta:
        model = Analysis
        fields = '__all__'


class Query(graphene.ObjectType):
    all_resumes = graphene.List(ResumeType)
    all_analyses = graphene.List(AnalysisType)
    resume_by_id = graphene.Field(ResumeType, id=graphene.Int(required=True))
    analysis_by_id = graphene.Field(AnalysisType, id=graphene.Int(required=True))
    
    def resolve_all_resumes(self, info):
        return Resume.objects.all().order_by('-uploaded_at')
    
    def resolve_all_analyses(self, info):
        return Analysis.objects.all().order_by('-created_at')
    
    def resolve_resume_by_id(self, info, id):
        try:
            return Resume.objects.get(pk=id)
        except Resume.DoesNotExist:
            return None
    
    def resolve_analysis_by_id(self, info, id):
        try:
            return Analysis.objects.get(pk=id)
        except Analysis.DoesNotExist:
            return None


class CreateAnalysis(graphene.Mutation):
    class Arguments:
        resume_id = graphene.Int(required=True)
        job_description = graphene.String(required=True)
    
    analysis = graphene.Field(AnalysisType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, resume_id, job_description):
        try:
            resume = Resume.objects.get(pk=resume_id)
            analysis = Analysis.objects.create(
                resume=resume,
                job_description=job_description
            )
            return CreateAnalysis(
                analysis=analysis,
                success=True,
                message="Analysis created successfully"
            )
        except Resume.DoesNotExist:
            return CreateAnalysis(
                analysis=None,
                success=False,
                message="Resume not found"
            )
        except Exception as e:
            return CreateAnalysis(
                analysis=None,
                success=False,
                message=str(e)
            )


class Mutation(graphene.ObjectType):
    create_analysis = CreateAnalysis.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
