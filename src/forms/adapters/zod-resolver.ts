import type { AtlFieldError, AtlResolver, AtlFormValues } from '../core/types';

type ZodIssue = {
	message: string;
	path: Array<number | string>;
};

type ZodErrorLike = {
	issues: ZodIssue[];
};

type ZodSafeParseResult<FormValues> =
	| {
			data: FormValues;
			success: true;
	  }
	| {
			error: ZodErrorLike;
			success: false;
	  };

type ZodSchemaLike<FormValues> = {
	safeParse?: (values: unknown) => ZodSafeParseResult<FormValues>;
	safeParseAsync?: (values: unknown) => Promise<ZodSafeParseResult<FormValues>>;
};

const createIssueError = (issue: ZodIssue): AtlFieldError => ({
	message: issue.message,
	type: 'zod',
});

export const createZodResolver = <Values extends AtlFormValues>(
	schema: ZodSchemaLike<Values>,
): AtlResolver<Values> => {
	return async (values) => {
		const result = schema.safeParseAsync
			? await schema.safeParseAsync(values)
			: schema.safeParse?.(values);

		if (!result || result.success) {
			return {};
		}

		return Object.fromEntries(
			result.error.issues.map((issue) => [issue.path.join('.'), createIssueError(issue)]),
		);
	};
};
