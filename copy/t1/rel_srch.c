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
 * rel_srch - checks if cmd is a valid path to a file.
 * @cmd: the string representing the pathname
 *
 * Return: 1 if the pathname is valid; 0 otherwise.
 */
int rel_srch(char *cmd)
{
	struct stat st;

	if (stat(cmd, &st) != 0)
	{
		return (0);
	}

	return (1);
}
