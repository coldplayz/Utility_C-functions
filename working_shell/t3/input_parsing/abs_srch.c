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
 * abs_srch - checks if cmd can be found in any
 * of the paths listed in the PATH environment variable.
 * @cmd: address of pointer to the string representing the command.
 * @envp: the process's environment.
 *
 * Description: the value of the first element of the array of
 * strings whose address is passed as sarr is modified to be a
 * pointer to the absolute path for the command, if it's found;
 * otherwise, if the command represented by that first
 * element is not found, the array of strings is made to point to NULL.
 */
void abs_srch(char ***sarr, char **envp)
{
	char *ptc;
	int i;

	ptc = isinPATH2((*sarr)[0], envp);
	if (!ptc)
	{
		free(*sarr);
		*sarr = NULL;
	}
	else
	{
		(*sarr)[0] = ptc;
	}
}
