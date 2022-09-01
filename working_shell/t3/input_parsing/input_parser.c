#include <sys/types.h>
#include <sys/stat.h>
#include <sys/wait.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <errno.h>
#include <signal.h>
#include <dirent.h>
#include "main.h"

#define ex (execve("/bin/ls", args, NULL) == (-1))
#define ps(x) (printf("%s\n", (x)))
#define pd(x) (printf("%d\n", (x)))

/**
 * in_parser - gets a line of input and
 * processes it to be suitable to be passed to execve().
 * @line: string representing the line of input to process.
 * @envp: the environment of the process as taken from main's third argument.
 *
 * Return: a NULL-terminated array of strings
 * representing each word from the command-line input;
 * or NULL if the first word is not a found command.
 */
char **in_parser(char *line, char *envp[])
{
	char **str_ar;
	int i;

	str_ar = str_arr(line, " \n"); /* 'line' is modified after call to str_ar */
	if ((!str_ar[0]) || (rel_srch(str_ar[0])))
	{
		return (str_ar);
	}

	abs_srch(&str_ar, envp);

	return (str_ar);
}
